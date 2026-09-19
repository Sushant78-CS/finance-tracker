const Transaction = require("../models/Transaction");

// =========================
// ADD TRANSACTION
// =========================

const addTransaction = async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    // Validation
    if (!type || !description || amount === undefined) {
      return res.status(400).json({
        message: "Type, description and amount are required",
      });
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    // Validate amount
    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const transaction = await Transaction.create({
      user: req.userId,
      type,
      description,
      amount: Number(amount),
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Add transaction error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET TRANSACTIONS
// =========================

const getTransactions = async (req, res) => {
  try {
    const {
      type,
      from,
      to,
      minAmount,
      maxAmount,
      sort = "date",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // =========================
    // BUILD FILTER
    // =========================

    const filter = {
      user: req.userId,
    };

    // Type filter
    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    // Amount filter
    if (minAmount || maxAmount) {
      filter.amount = {};

      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    // Date filter
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        filter.createdAt.$gte = new Date(`${from}T00:00:00`);
      }

      if (to) {
        filter.createdAt.$lte = new Date(`${to}T23:59:59`);
      }
    }

    // =========================
    // SORT
    // =========================

    const sortOptions = {};

    if (sort === "amount") {
      sortOptions.amount = order === "asc" ? 1 : -1;
    } else if (sort === "type") {
      sortOptions.type = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = order === "asc" ? 1 : -1;
    }

    // =========================
    // PAGINATION
    // =========================

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    // =========================
    // DATABASE QUERIES
    // =========================

    const transactions = await Transaction.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalTransactions = await Transaction.countDocuments(filter);

    const totalPages = Math.ceil(totalTransactions / limitNumber);

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      transactions,

      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalTransactions,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
};
