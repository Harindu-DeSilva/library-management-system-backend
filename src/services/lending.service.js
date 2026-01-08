const { Book, Category, Book_Lends, Library, User } = require("../models");
const { Op } = require("sequelize");
const codeEmail = require("../middlewares/sendMail");


exports.lendNewBook = async (data) => {

  const book = await Book.findOne({
    where: { id: data.book_id }
  });

  if (!book) throw new Error("Book not found");

  const category = await Category.findOne({
    where: { id: data.category_id, library_id: data.library_id }
  });

  if (!category) throw new Error("Invalid category or access denied");

  // --- Availability Checks ---
  if (data.quantity > book.available)
    throw new Error("Not enough available copies");

  const newAvailable = book.available - data.quantity;
  const newBorrowed = book.borrowed + data.quantity;

  // --- Create lending record ---
  const lendRecord = await Book_Lends.create({
    lend_user_id: data.lend_user_id,
    book_id: data.book_id,
    quantity: data.quantity,
    category_id: data.category_id,
    library_id: data.library_id,
    due_date: data.due_date,
  });

  // --- Update Book ---
  await Book.update(
    {
      available: newAvailable,
      borrowed: newBorrowed
    },
    {
      where: { id: data.book_id }
    }
  );

  return { lendRecord };
};



exports.getAllLendData = async (library_id, user_id, page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;

  const library = await Library.findOne({ where: { id: library_id } });
  if (!library) throw new Error("Library not found");

  // Update overdue books
  await Book_Lends.update(
    { status: "OVERDUE" },
    {
      where: {
        status: "BORROWED",
        due_date: { [Op.lt]: new Date() }
      }
    }
  );

  // Build search condition
  const searchCondition = search
    ? {
        [Op.or]: [
          { '$lendUser.name$': { [Op.like]: `%${search}%` } },
          { '$lendUser.email$': { [Op.like]: `%${search}%` } },
          { '$Book.title$': { [Op.like]: `%${search}%` } }
        ]
      }
    : {};

  // Fetch lends with pagination and search
  const { rows: lends, count } = await Book_Lends.findAndCountAll({
    where: {
      library_id,
      ...(user_id && { lend_user_id: user_id }),
      ...searchCondition
    },
    include: [
      { model: Book, attributes: ["title"] },
      { model: Category, attributes: ["category_name"] },
      { model: User, as: "lendUser", attributes: ["name", "email"] },
      { model: Library, attributes: ["name"] }
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  // Send overdue notifications
  for (const lend of lends) {
    if (lend.status === "OVERDUE" && lend.lendUser && !lend.overdue_notified) {
      await codeEmail.sendMail({
        from: process.env.CODE_SENDING_EMAIL_USER,
        to: lend.lendUser.email,
        subject: `${lend.Library.name} - Overdue Book Reminder - Library Management System`,
        html: `
          <p>Dear ${lend.lendUser.name},</p>
          <p>The book <b>${lend.Book.title}</b> you borrowed is now <b>OVERDUE</b>.</p>
          <p>Please return it as soon as possible.</p>
        `
      });

      lend.overdue_notified = true;
      await lend.save();
    }
  }

  return {
    lends,
    pagination: {
      totalLendRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      pageSize: limit
    }
  };
};



exports.updateLendData = async(data) => {

  const lend = await Book_Lends.findOne({where: {id: data.lend_id}});

  if(!lend) throw new Error('No record found');

  const updateRecord = await Book_Lends.update(
    {
      return_date: data.return_date,
      status: data.status
    },
    {
      where: {id: data.lend_id}
    }
  );

  if(!updateRecord) throw new Error('update failed');

  const book = await Book.findByPk(data.book_id);

  if(!book) throw new Error('Book not found');

  const newAvailable = book.available + data.quantity;
  const newBorrowed = book.borrowed - data.quantity;

  // --- Update Book ---
  if(data.status === "RETURNED"){
    if(lend.status === "RETURNED") throw new Error("Book already returned");

    await Book.update(
      {
        available: newAvailable,
        borrowed: newBorrowed
      },
      {
        where: { id: data.book_id }
      }
    );
  };


  const lends = await Book_Lends.findOne({where: {id: data.lend_id}});

  return lends;


};
