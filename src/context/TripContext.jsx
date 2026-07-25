import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const TripContext = createContext();

export function TripProvider({ children }) {
  // =====================================================
  // STATE
  // =====================================================

  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [drinks, setDrinks] = useState([]);

  const [tripSettings, setTripSettings] = useState(() => {
    const saved = localStorage.getItem("tripSettings");

    return saved
      ? JSON.parse(saved)
      : {
          targetContribution: 0,
          currency: "R",
        };
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");

    return saved ? JSON.parse(saved) : [];
  });

  const [accommodation, setAccommodation] = useState(() => {
    const saved = localStorage.getItem("accommodation");

    return saved ? JSON.parse(saved) : [];
  });

  const [
    selectedAccommodation,
    setSelectedAccommodation,
  ] = useState(() => {
    const saved = localStorage.getItem(
      "selectedAccommodation"
    );

    return saved ? JSON.parse(saved) : null;
  });


  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  async function loadPayments() {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading payments:",
        error
      );

      return;
    }

    setPayments(data || []);
  }

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading transactions:",
        error
      );

      return;
    }

    setTransactions(data || []);
  }

  // =====================================================
  // LOAD GROCERIES
  // =====================================================

  async function loadGroceries() {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading groceries:",
        error
      );

      return;
    }

    setGroceries(data || []);
  }

  // =====================================================
  // LOAD DRINKS
  // =====================================================

  async function loadDrinks() {
    const { data, error } = await supabase
      .from("drinks")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading drinks:",
        error
      );

      return;
    }

    setDrinks(data || []);
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadMembers();
    loadPayments();
    loadTransactions();
    loadGroceries();
    loadDrinks();
  }, []);

  // =====================================================
  // REALTIME
  // =====================================================

  useEffect(() => {
    const channel = supabase
      .channel("trip-data-realtime")

      // MEMBERS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members",
        },
        () => {
          loadMembers();
        }
      )

      // PAYMENTS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        () => {
          loadPayments();
        }
      )

      // TRANSACTIONS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => {
          loadTransactions();
        }
      )

      // GROCERIES
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "groceries",
        },
        () => {
          loadGroceries();
        }
      )

      // DRINKS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drinks",
        },
        () => {
          loadDrinks();
        }
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // =====================================================
  // LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "tripSettings",
      JSON.stringify(tripSettings)
    );
  }, [tripSettings]);

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(
      "accommodation",
      JSON.stringify(accommodation)
    );
  }, [accommodation]);

  useEffect(() => {
    localStorage.setItem(
      "selectedAccommodation",
      JSON.stringify(
        selectedAccommodation
      )
    );
  }, [selectedAccommodation]);

  // =====================================================
  // MEMBERS
  // =====================================================

 // =====================================================
// MEMBERS
// =====================================================

async function loadMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error loading members:",
      error
    );
    return;
  }

  setMembers(data || []);
}

async function addMember(member) {
  const { error } = await supabase
    .from("members")
    .insert([
      {
        name: member.name,
        email: member.email || null,
        phone: member.phone || null,

        monthly_contribution: Number(
          member.monthlyContribution || 0
        ),

        target_amount: Number(
          member.targetAmount || 0
        ),

        drink_preference:
          member.drink || null,

        emergency_contact:
          member.emergency || null,
      },
    ]);

  if (error) {
    alert(
      "Could not add member: " +
        error.message
    );
    return false;
  }

  await loadMembers();

  return true;
}

async function updateMember(updatedMember) {
  const { error } = await supabase
    .from("members")
    .update({
      name: updatedMember.name,
      email: updatedMember.email || null,
      phone: updatedMember.phone || null,

      monthly_contribution: Number(
        updatedMember.monthlyContribution || 0
      ),

      target_amount: Number(
        updatedMember.targetAmount || 0
      ),

      drink_preference:
        updatedMember.drink || null,

      emergency_contact:
        updatedMember.emergency || null,
    })
    .eq("id", updatedMember.id);

  if (error) {
    alert(
      "Could not update member: " +
        error.message
    );
    return false;
  }

  await loadMembers();

  return true;
}

async function deleteMember(id) {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) {
    alert(
      "Could not delete member: " +
        error.message
    );
    return false;
  }

  await loadMembers();

  return true;
}
  // =====================================================
  // PAYMENTS
  // =====================================================

  async function addPayment(payment) {
    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          member_id: payment.memberId,
          amount: Number(payment.amount),
          date: payment.date || null,
          contribution_month:
            payment.contributionMonth ||
            null,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(
        "Could not add payment: " +
          error.message
      );

      return null;
    }

    await loadPayments();

    return data;
  }

  async function deletePayment(id) {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "Could not delete payment: " +
          error.message
      );

      return false;
    }

    await loadPayments();

    return true;
  }

  // =====================================================
  // TRANSACTIONS
  // =====================================================

  async function addTransaction(
    transaction
  ) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          date:
            transaction.date || null,

          description:
            transaction.description || "",

          amount: Number(
            transaction.amount
          ),

          type:
            transaction.type || "",

          member_id:
            transaction.memberId || null,

          member:
            transaction.member || "",

          status:
            transaction.status ||
            "unmatched",

          transaction_key:
            transaction.transactionKey ||
            null,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(
        "Could not add transaction: " +
          error.message
      );

      return null;
    }

    await loadTransactions();

    return data;
  }

  async function deleteTransaction(
    id
  ) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "Could not delete transaction: " +
          error.message
      );

      return false;
    }

    await loadTransactions();

    return true;
  }

  // =====================================================
  // LINK TRANSACTION TO PAYMENT
  // =====================================================

  async function linkTransactionToPayment(
    transactionId,
    paymentId
  ) {
    const { error } = await supabase
      .from("transactions")
      .update({
        payment_id: paymentId,
      })
      .eq("id", transactionId);

    if (error) {
      alert(
        "Could not link transaction to payment: " +
          error.message
      );

      return false;
    }

    await loadTransactions();

    return true;
  }

  // =====================================================
  // GROCERIES
  // =====================================================

  async function addGrocery(
    grocery
  ) {
    const { error } = await supabase
      .from("groceries")
      .insert([
        {
          name: grocery.name,
          quantity: Number(
            grocery.quantity
          ),
          price: Number(
            grocery.price
          ),
          category:
            grocery.category || "",
          purchased:
            grocery.purchased || false,
        },
      ]);

    if (error) {
      alert(
        "Could not add grocery item: " +
          error.message
      );

      return false;
    }

    await loadGroceries();

    return true;
  }

  async function deleteGrocery(
    id
  ) {
    const { error } = await supabase
      .from("groceries")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "Could not delete grocery: " +
          error.message
      );

      return false;
    }

    await loadGroceries();

    return true;
  }

  async function toggleGroceryPurchased(
    id
  ) {
    const grocery =
      groceries.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    if (!grocery) {
      return false;
    }

    const { error } = await supabase
      .from("groceries")
      .update({
        purchased:
          !grocery.purchased,
      })
      .eq("id", id);

    if (error) {
      alert(
        "Could not update grocery: " +
          error.message
      );

      return false;
    }

    await loadGroceries();

    return true;
  }

  // =====================================================
  // DRINKS
  // =====================================================

  async function addDrink(
    drink
  ) {
    const { error } = await supabase
      .from("drinks")
      .insert([
        {
          name: drink.name,
          category:
            drink.category || "",
          quantity: Number(
            drink.quantity
          ),
          price: Number(
            drink.price
          ),
          purchased:
            drink.purchased || false,
        },
      ]);

    if (error) {
      alert(
        "Could not add drink: " +
          error.message
      );

      return false;
    }

    await loadDrinks();

    return true;
  }

  async function deleteDrink(
    id
  ) {
    const { error } = await supabase
      .from("drinks")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "Could not delete drink: " +
          error.message
      );

      return false;
    }

    await loadDrinks();

    return true;
  }

  async function toggleDrinkPurchased(
    id
  ) {
    const drink =
      drinks.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

    if (!drink) {
      return false;
    }

    const { error } = await supabase
      .from("drinks")
      .update({
        purchased:
          !drink.purchased,
      })
      .eq("id", id);

    if (error) {
      alert(
        "Could not update drink: " +
          error.message
      );

      return false;
    }

    await loadDrinks();

    return true;
  }

  // =====================================================
  // SETTINGS
  // =====================================================

  function updateTripSettings(
    settings
  ) {
    setTripSettings(settings);
  }

  // =====================================================
  // EXPENSES
  // =====================================================

  function addExpense(
    expense
  ) {
    const newExpense = {
      ...expense,
      id: Date.now(),
    };

    setExpenses(
      (previous) => [
        ...previous,
        newExpense,
      ]
    );
  }

  function deleteExpense(
    id
  ) {
    setExpenses(
      (previous) =>
        previous.filter(
          (expense) =>
            String(
              expense.id
            ) !==
            String(id)
        )
    );
  }

  // =====================================================
  // ACCOMMODATION
  // =====================================================

  function addAccommodation(
    option
  ) {
    const newOption = {
      ...option,
      id: Date.now(),
    };

    setAccommodation(
      (previous) => [
        ...previous,
        newOption,
      ]
    );
  }

  function deleteAccommodation(
    id
  ) {
    setAccommodation(
      (previous) =>
        previous.filter(
          (option) =>
            String(
              option.id
            ) !==
            String(id)
        )
    );
  }

  function selectAccommodation(
    id
  ) {
    setSelectedAccommodation(
      id
    );
  }

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <TripContext.Provider
      value={{
        // MEMBERS
        members,
        addMember,
        deleteMember,
        updateMember,

        // PAYMENTS
        payments,
        addPayment,
        deletePayment,

        // TRANSACTIONS
        transactions,
        addTransaction,
        deleteTransaction,
        linkTransactionToPayment,

        // SETTINGS
        tripSettings,
        updateTripSettings,

        // GROCERIES
        groceries,
        addGrocery,
        deleteGrocery,
        toggleGroceryPurchased,

        // DRINKS
        drinks,
        addDrink,
        deleteDrink,
        toggleDrinkPurchased,

        // EXPENSES
        expenses,
        addExpense,
        deleteExpense,

        // ACCOMMODATION
        accommodation,
        addAccommodation,
        deleteAccommodation,
        selectedAccommodation,
        selectAccommodation,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(
    TripContext
  );
}