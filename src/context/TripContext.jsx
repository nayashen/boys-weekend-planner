import { createContext, useContext, useState } from "react";
import initialMembers from "../data/members";

const TripContext = createContext();

export function TripProvider({ children }) {
  // =========================
  // MEMBERS
  // =========================

  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem(
      "boysWeekendMembers"
    );

    return savedMembers
      ? JSON.parse(savedMembers)
      : initialMembers;
  });

  // =========================
  // PAYMENTS
  // =========================

  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem(
      "boysWeekendPayments"
    );

    return savedPayments
      ? JSON.parse(savedPayments)
      : [];
  });

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] =
    useState(() => {
      const savedTransactions =
        localStorage.getItem(
          "boysWeekendTransactions"
        );

      return savedTransactions
        ? JSON.parse(savedTransactions)
        : [];
    });

  // =========================
  // GROCERIES
  // =========================

  const [groceries, setGroceries] = useState(() => {
    const savedGroceries = localStorage.getItem(
      "boysWeekendGroceries"
    );

    return savedGroceries
      ? JSON.parse(savedGroceries)
      : [];
  });

  // =========================
  // DRINKS
  // =========================

  const [drinks, setDrinks] = useState(() => {
    const savedDrinks = localStorage.getItem(
      "boysWeekendDrinks"
    );

    return savedDrinks
      ? JSON.parse(savedDrinks)
      : [];
  });

  // =========================
  // ACCOMMODATION
  // =========================

  const [accommodation, setAccommodation] =
    useState(() => {
      const savedAccommodation =
        localStorage.getItem(
          "boysWeekendAccommodation"
        );

      return savedAccommodation
        ? JSON.parse(savedAccommodation)
        : [];
    });

  const [
    selectedAccommodation,
    setSelectedAccommodation,
  ] = useState(() => {
    const savedSelection =
      localStorage.getItem(
        "boysWeekendSelectedAccommodation"
      );

    return savedSelection
      ? JSON.parse(savedSelection)
      : null;
  });

  // =========================
  // EXPENSES
  // =========================

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem(
      "boysWeekendExpenses"
    );

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [];
  });

  // =========================
  // TRIP SETTINGS
  // =========================

  const [tripSettings, setTripSettings] =
    useState(() => {
      const savedSettings =
        localStorage.getItem(
          "boysWeekendTripSettings"
        );

      return savedSettings
        ? JSON.parse(savedSettings)
        : {
            tripName: "Boys Weekend",
            destination: "",
            startDate: "",
            endDate: "",
            targetContribution: 5000,
            currency: "R",
          };
    });

  // =========================
  // GALLERY
  // =========================

  const [galleryItems, setGalleryItems] =
    useState(() => {
      const savedGallery =
        localStorage.getItem(
          "boysWeekendGallery"
        );

      return savedGallery
        ? JSON.parse(savedGallery)
        : [];
    });

  // =========================
  // MEMBERS
  // =========================

  function addMember(member) {
    const updatedMembers = [
      ...members,
      {
        ...member,
        id: Date.now(),
      },
    ];

    setMembers(updatedMembers);

    localStorage.setItem(
      "boysWeekendMembers",
      JSON.stringify(updatedMembers)
    );
  }

  function updateMember(updatedMember) {
    const updatedMembers = members.map(
      (member) =>
        String(member.id) ===
        String(updatedMember.id)
          ? {
              ...member,
              ...updatedMember,
            }
          : member
    );

    setMembers(updatedMembers);

    localStorage.setItem(
      "boysWeekendMembers",
      JSON.stringify(updatedMembers)
    );
  }

  function deleteMember(memberId) {
    const updatedMembers = members.filter(
      (member) =>
        String(member.id) !==
        String(memberId)
    );

    setMembers(updatedMembers);

    localStorage.setItem(
      "boysWeekendMembers",
      JSON.stringify(updatedMembers)
    );
  }

  // =========================
  // PAYMENTS
  // =========================

  function addPayment(payment) {
    const newPayment = {
      ...payment,
      id: Date.now() + Math.random(),
    };

    setPayments((currentPayments) => {
      const updatedPayments = [
        ...currentPayments,
        newPayment,
      ];

      localStorage.setItem(
        "boysWeekendPayments",
        JSON.stringify(updatedPayments)
      );

      return updatedPayments;
    });
  }

  function updatePayment(updatedPayment) {
    setPayments((currentPayments) => {
      const updatedPayments =
        currentPayments.map((payment) =>
          String(payment.id) ===
          String(updatedPayment.id)
            ? {
                ...payment,
                ...updatedPayment,
              }
            : payment
        );

      localStorage.setItem(
        "boysWeekendPayments",
        JSON.stringify(updatedPayments)
      );

      return updatedPayments;
    });
  }

  function deletePayment(paymentId) {
    setPayments((currentPayments) => {
      const updatedPayments =
        currentPayments.filter(
          (payment) =>
            String(payment.id) !==
            String(paymentId)
        );

      localStorage.setItem(
        "boysWeekendPayments",
        JSON.stringify(updatedPayments)
      );

      return updatedPayments;
    });
  }

  // =========================
  // TRANSACTIONS
  // =========================

  function addTransactions(
    newTransactions
  ) {
    setTransactions((currentTransactions) => {
      const transactionsWithIds =
        newTransactions.map(
          (transaction, index) => ({
            ...transaction,
            id:
              Date.now() +
              index +
              Math.random(),
          })
        );

      const updatedTransactions = [
        ...currentTransactions,
        ...transactionsWithIds,
      ];

      localStorage.setItem(
        "boysWeekendTransactions",
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    });
  }

  function addTransaction(transaction) {
    addTransactions([transaction]);
  }

  function updateTransaction(
    updatedTransaction
  ) {
    setTransactions((currentTransactions) => {
      const updatedTransactions =
        currentTransactions.map(
          (transaction) =>
            String(transaction.id) ===
            String(updatedTransaction.id)
              ? {
                  ...transaction,
                  ...updatedTransaction,
                }
              : transaction
        );

      localStorage.setItem(
        "boysWeekendTransactions",
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    });
  }

  function deleteTransaction(transactionId) {
    setTransactions((currentTransactions) => {
      const updatedTransactions =
        currentTransactions.filter(
          (transaction) =>
            String(transaction.id) !==
            String(transactionId)
        );

      localStorage.setItem(
        "boysWeekendTransactions",
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    });
  }

  // =========================
  // GROCERIES
  // =========================

  function addGrocery(grocery) {
    const updatedGroceries = [
      ...groceries,
      {
        ...grocery,
        id: Date.now(),
      },
    ];

    setGroceries(updatedGroceries);

    localStorage.setItem(
      "boysWeekendGroceries",
      JSON.stringify(updatedGroceries)
    );
  }

  function updateGrocery(updatedGrocery) {
    const updatedGroceries = groceries.map(
      (grocery) =>
        String(grocery.id) ===
        String(updatedGrocery.id)
          ? {
              ...grocery,
              ...updatedGrocery,
            }
          : grocery
    );

    setGroceries(updatedGroceries);

    localStorage.setItem(
      "boysWeekendGroceries",
      JSON.stringify(updatedGroceries)
    );
  }

  function toggleGroceryPurchased(
    groceryId
  ) {
    const updatedGroceries = groceries.map(
      (grocery) =>
        String(grocery.id) ===
        String(groceryId)
          ? {
              ...grocery,
              purchased: !grocery.purchased,
            }
          : grocery
    );

    setGroceries(updatedGroceries);

    localStorage.setItem(
      "boysWeekendGroceries",
      JSON.stringify(updatedGroceries)
    );
  }

  function deleteGrocery(groceryId) {
    const updatedGroceries = groceries.filter(
      (grocery) =>
        String(grocery.id) !==
        String(groceryId)
    );

    setGroceries(updatedGroceries);

    localStorage.setItem(
      "boysWeekendGroceries",
      JSON.stringify(updatedGroceries)
    );
  }

  // =========================
  // DRINKS
  // =========================

  function addDrink(drink) {
    const updatedDrinks = [
      ...drinks,
      {
        ...drink,
        id: Date.now(),
      },
    ];

    setDrinks(updatedDrinks);

    localStorage.setItem(
      "boysWeekendDrinks",
      JSON.stringify(updatedDrinks)
    );
  }

  function toggleDrinkPurchased(
    drinkId
  ) {
    const updatedDrinks = drinks.map(
      (drink) =>
        String(drink.id) ===
        String(drinkId)
          ? {
              ...drink,
              purchased: !drink.purchased,
            }
          : drink
    );

    setDrinks(updatedDrinks);

    localStorage.setItem(
      "boysWeekendDrinks",
      JSON.stringify(updatedDrinks)
    );
  }

  function deleteDrink(drinkId) {
    const updatedDrinks = drinks.filter(
      (drink) =>
        String(drink.id) !==
        String(drinkId)
    );

    setDrinks(updatedDrinks);

    localStorage.setItem(
      "boysWeekendDrinks",
      JSON.stringify(updatedDrinks)
    );
  }

  // =========================
  // ACCOMMODATION
  // =========================

  function addAccommodation(option) {
    const updatedAccommodation = [
      ...accommodation,
      {
        ...option,
        id: Date.now(),
        votes: 0,
      },
    ];

    setAccommodation(updatedAccommodation);

    localStorage.setItem(
      "boysWeekendAccommodation",
      JSON.stringify(updatedAccommodation)
    );
  }

  function voteAccommodation(id) {
    const updatedAccommodation =
      accommodation.map((option) =>
        String(option.id) === String(id)
          ? {
              ...option,
              votes:
                Number(option.votes || 0) +
                1,
            }
          : option
      );

    setAccommodation(updatedAccommodation);

    localStorage.setItem(
      "boysWeekendAccommodation",
      JSON.stringify(updatedAccommodation)
    );
  }

  function selectAccommodation(id) {
    setSelectedAccommodation(id);

    localStorage.setItem(
      "boysWeekendSelectedAccommodation",
      JSON.stringify(id)
    );
  }

  function deleteAccommodation(
    accommodationId
  ) {
    const updatedAccommodation =
      accommodation.filter(
        (option) =>
          String(option.id) !==
          String(accommodationId)
      );

    setAccommodation(updatedAccommodation);

    localStorage.setItem(
      "boysWeekendAccommodation",
      JSON.stringify(updatedAccommodation)
    );

    if (
      String(selectedAccommodation) ===
      String(accommodationId)
    ) {
      setSelectedAccommodation(null);

      localStorage.removeItem(
        "boysWeekendSelectedAccommodation"
      );
    }
  }

  // =========================
  // EXPENSES
  // =========================

  function addExpense(expense) {
    const updatedExpenses = [
      ...expenses,
      {
        ...expense,
        id: Date.now(),
      },
    ];

    setExpenses(updatedExpenses);

    localStorage.setItem(
      "boysWeekendExpenses",
      JSON.stringify(updatedExpenses)
    );
  }

  function deleteExpense(expenseId) {
    const updatedExpenses = expenses.filter(
      (expense) =>
        String(expense.id) !==
        String(expenseId)
    );

    setExpenses(updatedExpenses);

    localStorage.setItem(
      "boysWeekendExpenses",
      JSON.stringify(updatedExpenses)
    );
  }

  // =========================
  // GALLERY
  // =========================

  function addGalleryItem(item) {
    const newItem = {
      ...item,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
    };

    setGalleryItems((currentItems) => {
      const updatedItems = [
        ...currentItems,
        newItem,
      ];

      localStorage.setItem(
        "boysWeekendGallery",
        JSON.stringify(updatedItems)
      );

      return updatedItems;
    });
  }

  function updateGalleryItem(
    updatedItem
  ) {
    setGalleryItems((currentItems) => {
      const updatedItems = currentItems.map(
        (item) =>
          String(item.id) ===
          String(updatedItem.id)
            ? {
                ...item,
                ...updatedItem,
              }
            : item
      );

      localStorage.setItem(
        "boysWeekendGallery",
        JSON.stringify(updatedItems)
      );

      return updatedItems;
    });
  }

  function deleteGalleryItem(itemId) {
    setGalleryItems((currentItems) => {
      const updatedItems = currentItems.filter(
        (item) =>
          String(item.id) !==
          String(itemId)
      );

      localStorage.setItem(
        "boysWeekendGallery",
        JSON.stringify(updatedItems)
      );

      return updatedItems;
    });
  }

  // =========================
  // TRIP SETTINGS
  // =========================

  function updateTripSettings(
    updatedSettings
  ) {
    setTripSettings(updatedSettings);

    localStorage.setItem(
      "boysWeekendTripSettings",
      JSON.stringify(updatedSettings)
    );
  }

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    // Data
    members,
    payments,
    transactions,
    groceries,
    drinks,
    accommodation,
    selectedAccommodation,
    expenses,
    tripSettings,
    galleryItems,

    // Members
    addMember,
    updateMember,
    deleteMember,

    // Payments
    addPayment,
    updatePayment,
    deletePayment,

    // Transactions
    addTransaction,
    addTransactions,
    updateTransaction,
    deleteTransaction,

    // Groceries
    addGrocery,
    updateGrocery,
    toggleGroceryPurchased,
    deleteGrocery,

    // Drinks
    addDrink,
    toggleDrinkPurchased,
    deleteDrink,

    // Accommodation
    addAccommodation,
    voteAccommodation,
    selectAccommodation,
    deleteAccommodation,

    // Expenses
    addExpense,
    deleteExpense,

    // Gallery
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,

    // Trip Settings
    updateTripSettings,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}