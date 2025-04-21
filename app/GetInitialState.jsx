import { useRouter } from "next/navigation"
import { useEffect } from 'react';
import { supabase } from "./lib/supabaseClient";

export default function GetInitialState({ children }) {
    const router = useRouter()
    useEffect(() => {
        const checkUser = async () => {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            router.push('/auth'); // redirect to auth page
          } else {
            router.push('/dashboard'); // or whatever your logged-in page is
          }
        };
    
        checkUser();
      }, []);

    return <>{children}</>

}