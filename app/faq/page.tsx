export const metadata = {
  title: "FAQ | BRM CSGO",
  description: "CS GO Skins Marketplace",
};

export default async function Page() {
  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <h1>FAQ</h1>

      <div className="flex flex-col mt-12 space-y-16 w-[900px]">
        <div className="flex flex-col space-y-4">
          <h2>I replenished the balance - the money did not come - what should I do?</h2>

          <span className="text-body-1 break-words">
            Sometimes there are delays in replenishing the balance lasting up to 3-40
            minutes. If the payment status in the history of your payment system is
            indicated as “Successful” and the money has not been credited to you after 40
            minutes, write a support request with the following text: Problem: Topped up
            the balance and no money received How did you top up: Payment amount including
            commission: Receipt screenshot payment: (Post a screenshot of the check on any
            image hosting and insert the link into the ticket. An example of sites where
            you can post your pictures is https://imgur.com/ https://imgbb.com/ ) After
            that, wait for a response from support - answers are given in order of the
            queue, any new message in the ticket from you - sends the ticket to the very
            end of the queue.
          </span>
        </div>
        <div className="flex flex-col space-y-4">
          <h2>I bought items - but the trade did not received - what should I do?</h2>

          <span className="text-body-1 break-words">
            Output of items is in semi-automatic mode, sometimes there are delays in the
            output of items for technical reasons, you can always see the status of your
            order in the profile If the order status in the history of your payment system
            is indicated as “Completed” and the trade has not been received to you after
            40 minutes, write a support request
          </span>
        </div>
      </div>
    </main>
  );
}
