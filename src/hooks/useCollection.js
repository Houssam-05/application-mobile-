import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useState, useEffect } from "react";
const useCollection = (col) => {
  const [documents, setDocuments] = useState(null);
  useEffect(() => {
    const ref = collection(db, col);

    const unsubscribe = getDocs(ref).then((snap) => {
      let res = [];
      snap.docs.forEach((doc) => {
        res.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(res);
    });
    return () => unsubscribe();
  }, [col]);

  return { documents };
};
export { useCollection };
