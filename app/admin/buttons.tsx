"use client";

import { useRouter } from "next/navigation";

import { PrimaryButton, SecondaryButton } from "@/components/input/buttons";
import { Order, OrderState } from "@prisma/client";

import { toast } from "react-toastify";

interface OrderProps {
  order: Order;
}

const OrderButtons: React.FC<OrderProps> = ({ order }) => {
  const router = useRouter();

  const updateOrderState = (state: OrderState) => {
    const updatePromise = fetch(`/api/admin/order/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        state: state,
      }),
    }).then((res) => {
      if (!res.ok) {
        return Promise.reject(res.status);
      }

      router.refresh();
    });

    toast.promise(
      updatePromise,
      {
        pending: "Update order state",
        success: "Order updated 👌",
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
  };

  return (
    <>
      <SecondaryButton
        text="Cancel"
        style={{
          height: "40px",
        }}
        onClick={() => updateOrderState(OrderState.CANCELED)}
      />
      <PrimaryButton
        text="Complete"
        style={{
          height: "40px",
        }}
        onClick={() => updateOrderState(OrderState.COMPLETED)}
      />
    </>
  );
};

export { OrderButtons };
