import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { PrimaryButton } from "./buttons";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const SupportModal = NiceModal.create(() => {
  const modal = useModal();

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.success("Ticket created", {
      autoClose: 1500,
      className(context) {
        return `relative flex p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-shade-300 ${
          context?.type === "error" ? "text-error-100" : "text-white"
        }`;
      },
      progressClassName: "bg-primary-100",
    });

    modal.remove();
  };

  return (
    <div
      id="backdrop"
      onClick={() => modal.remove()}
      className="bg-black bg-opacity-50 z-10 backdrop-blur-sm fixed inset-0 flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-shade-200 p-5 rounded-[20px] flex flex-col items-center justify-center space-y-6"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1>New support request</h1>

          <h3 className="mt-2 text-center">
            Before creating a new request, we recommend <br /> that our
            specialists familiarize themselves with our{" "}
            <Link
              href="/faq"
              className="text-primary-200 hover:text-primary-300 active:text-primary-100"
              onClick={() => modal.remove()}
            >
              FAQ
            </Link>{" "}
            section, <br />
            perhaps there you will find the answer to your question much faster
          </h3>
        </div>

        <div className="w-full mt-2 p-[2px] bg-transparent rounded-[10px] focus-within:bg-gradient-200 transition-all delay-75">
          <div className="bg-shade-300 rounded-[10px] pl-5 pt-5 h-64 flex items-center justify-between">
            <textarea
              className="w-full h-full bg-transparent outline-none resize-none"
              placeholder="Describe you problem..."
              required
            ></textarea>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <span className="text-body-1 font-body-1">Your email</span>

          <div className="w-full mt-2 p-[2px] bg-transparent rounded-[10px] focus-within:bg-gradient-200 transition-all delay-75">
            <div className="bg-shade-300 rounded-[10px] pl-5 h-12 flex items-center justify-between">
              <input
                className="w-full bg-transparent outline-none"
                type="email"
                required
                placeholder="example@gmail.com"
              ></input>
            </div>
          </div>
        </div>

        <PrimaryButton
          text="Create a ticket"
          type="submit"
          style={{
            width: "200px",
            height: "40px",
          }}
        />
      </form>
    </div>
  );
});

export const ShowSupport = () => {
  NiceModal.show(SupportModal);
};
