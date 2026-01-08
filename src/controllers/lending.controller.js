const { lendNewBook, getAllLendData, updateLendData } = require("../services/lending.service");
const { lendingCreateValidationSchema, lendingUpdateValidationSchema } = require("../validations/lendingValidation");
const ExcelJS = require("exceljs");

exports.LendBooksToUsers = async (req,res) => {
  try{
    const { book_id } = req.params;
    const { lend_user_id, quantity, category_id, library_id,  due_date } = req.body;

    const { error, value } = await lendingCreateValidationSchema.validate({
      lend_user_id, book_id, quantity, category_id, library_id, due_date
    });

    if(error){
      return res.status(400).json({message: error.details[0].message});
    }

    const lendBook = await lendNewBook({...value})

    return res.status(201).json({success: true, lendBook});


  }catch(error){
    console.error(error);
    return res.status(500).json({success:false, message: error.message});
  }
};


exports.fetchAllLendRecords = async (req,res) => {

  try{
    const { library_id, user_id } = req.user;

    const result = await getAllLendData(library_id, user_id);

    if(result.lends.length === 0){
      return res.status(404).json({success: false, message: 'records not found'});
    }

    return res.status(200).json({success: true, result});

  }catch(error){
    return res.status(500).json({success: false, Error: error.message});
  }

};


exports.updateLendRecords = async (req,res) => {
  try{

    const { lend_id } = req.params;
    const { book_id, status, quantity, return_date } = req.body;

    console.log(lend_id, book_id, status, quantity, return_date);

    const { error,value } = await lendingUpdateValidationSchema.validate({book_id, quantity, return_date, status});

    if(error){
      return res.status(400).json({success: false, message: error.details[0].message});
    }

    const result = await updateLendData({...value, lend_id});

    if(!result){
      return res.status(400).json({success: false, message: 'update failed'});
    }

    return res.status(200).json({success: true, result});

  }catch(error){
    console.error(error);
    return res.status(500).json({success:false, Error: error.message});
  }
};



exports.exportLendDataToExcel = async (req, res) => {
  const { library_id, user_id } = req.user;

  try {

    // Re-use your existing service
    const { lends } = await getAllLendData(library_id, user_id, 1, 10000);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Lend Records");

    // Columns
    worksheet.columns = [
      { header: "Book Title", key: "title", width: 30 },
      { header: "Quantity", key: "qty", width: 30 },
      { header: "Category", key: "category", width: 20 },
      { header: "Library", key: "library", width: 30 },
      { header: "Borrower", key: "user", width: 25 },
      { header: "Borrower's Email", key: "email", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Borrowed Date", key: "borrowed", width: 20 },
      { header: "Due Date", key: "due", width: 20 },
      { header: "Return Date", key: "return", width: 20 },
    ];

    // Rows
    lends.forEach(lend => {
      worksheet.addRow({
        title: lend.Book?.title ?? "-",
        qty: lend.quantity ?? "-",
        category: lend.Category?.category_name ?? "-",
        library: lend.Library?.name ?? "-",
        user: lend.lendUser?.name ?? "-",
        email: lend.lendUser?.email ?? "-",
        status: lend.status,
        borrowed: lend.createdAt?.toISOString().slice(0,10),
        due: lend.due_date?.toISOString().slice(0,10),
        return: lend.return_date?.toISOString().slice(0,10)
      });
    });

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=LendRecords.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export excel" });
  }
};
