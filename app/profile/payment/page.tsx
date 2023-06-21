"use client";

import { useState } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { PaymentMethod, PaymentResponse } from "@/types";

import { toast } from "react-toastify";
import { PrimaryButton } from "@/components/input/buttons";

export default function Page() {
  const { data: session, status } = useSession();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (status === "loading") {
    return <div></div>;
  }

  async function paymentRequest() {
    const orderPromise = fetch("/api/user/payment", {
      method: "POST",
      body: JSON.stringify({
        amount: parseFloat(amount),
        paymentMethod: PaymentMethod[paymentMethod as keyof typeof PaymentMethod],
      }),
    }).then(async (res) => {
      if (!res.ok) {
        return Promise.reject(res.status);
      }

      const data: PaymentResponse = await res.json();

      window.open(data.result.redirectUrl);
    });

    toast.promise(
      orderPromise,
      {
        pending: "Payment is pending",
        success: "Payment created 👌",
        error: {
          render(props) {
            return "Unknown error 🤯";
          },
        },
      },
      {
        autoClose: 1500,
        className(context) {
          return `relative flex p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-shade-300 ${
            context?.type === "error" ? "text-error-100" : "text-white"
          }`;
        },
        progressClassName: "bg-primary-100",
      }
    );
  }

  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <h1>Payment</h1>

      <div className="mt-12 flex flex-col space-y-12">
        <div className="flex justify-center items-center space-x-4">
          {Object.keys(PaymentMethod).map((method) => (
            <div
              key={method}
              onClick={() => setPaymentMethod(method)}
              className="flex flex-col items-center justify-center cursor-pointer active:text-primary-100"
            >
              <div className="bg-shade-300 hover:bg-gradient-100 active:bg-shade-400 active:bg-none hover:shadow-custom active:shadow-shade-400 hover:shadow-primary-100 w-52 h-24 rounded-[10px] relative">
                <Image
                  loading="lazy"
                  src={`/icons/${method}.svg`}
                  fill
                  className="object-contain p-3"
                  alt={method}
                />
              </div>
              <h3 className="mt-2 text-center">
                {PaymentMethod[method as keyof typeof PaymentMethod]}
              </h3>
            </div>
          ))}
        </div>

        {paymentMethod && (
          <div className="bg-shade-200 rounded-[20px] p-10 flex flex-col space-y-12">
            <div className="flex justify-between border-b pb-4 border-shade-300">
              <div className="flex flex-col space-y-4">
                <h1>Selected payment:</h1>
                <h2>{PaymentMethod[paymentMethod as keyof typeof PaymentMethod]}</h2>
              </div>
              <div className="flex flex-col space-y-4">
                <Image
                  loading="lazy"
                  src={`/icons/${paymentMethod}.svg`}
                  width={208}
                  height={96}
                  alt={paymentMethod}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 w-64">
              <h3>Amount</h3>

              <div className="w-full mt-2 p-[2px] bg-transparent rounded-[10px] focus-within:bg-gradient-200 transition-all delay-75">
                <div className="bg-shade-300 rounded-[10px] pl-5 h-12 flex items-center justify-between">
                  <input
                    value={amount}
                    placeholder="1000"
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent outline-none"
                    type="number"
                  ></input>
                </div>
              </div>
            </div>

            <PrimaryButton
              disabled={!amount || parseFloat(amount) < 1}
              text="Refill"
              style={{
                height: "48px",
              }}
              onClick={paymentRequest}
            />

            <span className="text-body-2 font-body-2">
              You will be redirected to the payment system website, where you can complete
              the payment. <br />
              The commission is charged in accordance with the tariffs of the selected
              payment system.
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
