import { useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, where } from "@firebase/firestore";
import { useAuth } from "./useAuth"; // assuming you have a useAuth hook
import { clientFirestore } from "@/admin/lib/firebaseClient";

export const useBilling = () => {
  const [billingData, setBillingData] = useState(null);
  const [allBills, setAllBills] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMonthlyBilling, setLoadingMonthlyBilling] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (!userData || !userData.board) {
      return;
    }

    const billingDocRef = doc(clientFirestore, "billing", userData.board);

    const unsubscribe = onSnapshot(
      billingDocRef,
      (doc) => {
        if (doc.exists()) {
          const billingData = doc.data();
          setBillingData(billingData);
        } else {
          setBillingData(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        console.error(error);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [userData]);

  useEffect(() => {
    if (!billingData || !userData || !userData.board) {
      return;
    }
    
    const billCollection = collection(clientFirestore, "monthly_bills");
    const q = query(billCollection, where("board", "==", userData.board));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const billMap = {};
        snapshot.docs.map((doc) => {
          const data = doc.data();
          billMap[data.key] = data.charges;
        });
        setAllBills(billMap);
        setLoadingMonthlyBilling(false);
      },
      (error) => {
        setError(error);
        console.error(error.message);
        setLoadingMonthlyBilling(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [billingData, userData]);

  return { billingData, allBills, loading, loadingMonthlyBilling, error };
};
