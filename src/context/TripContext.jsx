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

  const [tripSettings, setTripSettings] =
    useState(() => {
      const saved =
        localStorage.getItem("tripSettings");

      return saved
        ? JSON.parse(saved)
        : {
            targetContribution: 0,
            currency: "R",
          };
    });

  const [expenses, setExpenses] =
    useState(() => {
      const saved =
        localStorage.getItem("expenses");

      return saved
        ? JSON.parse(saved)
        : [];
    });

  const [accommodation, setAccommodation] =
    useState(() => {
      const saved =
        localStorage.getItem("accommodation");

      return saved
        ? JSON.parse(saved)
        : [];
    });

  const [
    selectedAccommodation,
    setSelectedAccommodation,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "selectedAccommodation"
      );

    return saved
      ? JSON.parse(saved)
      : null;
  });

  // =====================================================
  // LOAD MEMBERS
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
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadMembers();
    loadPayments();
    loadTransactions();
    loadGroceries();
  }, []);

  // =====================================================
  // SUPABASE REALTIME
  //
  // IMPORTANT:
  // ALL .on() CALLBACKS ARE REGISTERED
  // BEFORE .subscribe()
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
      );

    // SUBSCRIBE ONLY AFTER ALL .on() CALLBACKS
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

  async function addMember(member) {
    const { error } = await supabase
      .from("members")
      .insert([
        {
          name: member.name,
          email: member.email || null,
          phone: member.phone || null,
          monthly_contribution: Number(
            member.monthlyContribution ||
              member.contribution ||
              0
          ),
        },
      ]);

    if (error) {
      console.error(
        "Error adding member:",
        error
      );

      alert(
        "Could not add member: " +
          error.message
      );

      return false;
    }

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

    return true;
  }

  async function updateMember(
    updatedMember
  ) {
    const { error } = await supabase
      .from("members")
      .update({
        name: updatedMember.name,
        email:
          updatedMember.email || null,
        phone:
          updatedMember.phone || null,
        monthly_contribution: Number(
          updatedMember.monthlyContribution ||
            updatedMember.contribution ||
            0
        ),
      })
      .eq("id", updatedMember.id);

    if (error) {
      alert(
        "Could not update member: " +
          error.message
      );

      return false;
    }

    return true;
  }

  // =====================================================
  // PAYMENTS
  // =====================================================

  async function addPayment(payment) {
    const { error } = await supabase
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
      ]);

    if (error) {
      console.error(
        "Error adding payment:",
        error
      );

      alert(
        "Could not add payment: " +
          error.message
      );

      return false;
    }

    return true;
  }

  async function deletePayment(id) {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting payment:",
        error
      );

      return false;
    }

    return true;
  }

  // =====================================================
  // TRANSACTIONS
  // =====================================================

  async function addTransaction(
    transaction
  ) {
    const { error } = await supabase
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
      ]);

    if (error) {
      console.error(
        "Error adding transaction:",
        error
      );

      return false;
    }

    return true;
  }

  async function deleteTransaction(id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting transaction:",
        error
      );

      return false;
    }

    return true;
  }

  // =====================================================
  // GROCERIES
  // =====================================================

  async function addGrocery(grocery) {
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

    return true;
  }

  async function deleteGrocery(id) {
    const { error } = await supabase
      .from("groceries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting grocery:",
        error
      );

      return false;
    }

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

    if (!grocery) return false;

    const { error } = await supabase
      .from("groceries")
      .update({
        purchased:
          !grocery.purchased,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Error updating grocery:",
        error
      );

      return false;
    }

    return true;
  }

  // =====================================================
  // SETTINGS
  // =====================================================

  function updateTripSettings(settings) {
    setTripSettings(settings);
  }

  // =====================================================
  // EXPENSES
  // =====================================================

  function addExpense(expense) {
    const newExpense = {
      ...expense,
      id: Date.now(),
    };

    setExpenses((previous) => [
      ...previous,
      newExpense,
    ]);
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter(
        (expense) =>
          String(expense.id) !==
          String(id)
      )
    );
  }

  // =====================================================
  // ACCOMMODATION
  // =====================================================

  function addAccommodation(option) {
    const newOption = {
      ...option,
      id: Date.now(),
    };

    setAccommodation((previous) => [
      ...previous,
      newOption,
    ]);
  }

  function deleteAccommodation(id) {
    setAccommodation((previous) =>
      previous.filter(
        (option) =>
          String(option.id) !==
          String(id)
      )
    );
  }

  function selectAccommodation(id) {
    setSelectedAccommodation(id);
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

        // SETTINGS
        tripSettings,
        updateTripSettings,

        // GROCERIES
        groceries,
        addGrocery,
        deleteGrocery,
        toggleGroceryPurchased,

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
  return useContext(TripContext);
}