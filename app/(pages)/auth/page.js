"use client";


import UIAuth from "./components/uiAuth";
import {Suspense} from "react";

const Auth = () => {


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UIAuth/>
        </Suspense>
    );
};



export default Auth;
