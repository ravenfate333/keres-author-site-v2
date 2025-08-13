import { useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

const MailchimpForm = () => {
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ state: "error", message: "Please enter a valid email." });
      return;
    }
    setStatus({ state: "submitting" });

    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", honey }),
      });
      const data = await res.json();

      if (res.ok && (data.status === "pending" || data.status === "subscribed" || data.status === "stub")) {
        setStatus({
          state: "success",
          message: data.status === "subscribed" ? "You’re already on the list!" : "Almost there — check your inbox.",
        });
        setEmail("");
        setHoney("");
      } else {
        setStatus({ state: "error", message: data?.message || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  };

  const disabled = status.state === "submitting";

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Join My Newsletter!</h3>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md mx-auto flex flex-col sm:flex-row items-stretch justify-center gap-2"
      >
        {/* Email (required) */}
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email"
          className="p-2 rounded-md text-gray-900 flex-1 min-w-[16rem]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={disabled}
        />

        {/* Honeypot (hidden) */}
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
          className="hidden"
        />

        <button
          type="submit"
          disabled={disabled}
          className="bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:pointer-events-none text-white font-bold py-2 px-4 rounded-md whitespace-nowrap"
        >
          {status.state === "submitting" ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      <p
        className={`min-h-[1.1rem] text-[12px] leading-snug mt-1 ${
          status.state === "error"
            ? "text-red-300"
            : status.state === "success"
            ? "text-green-300"
            : "text-gray-400"
        }`}
        aria-live="polite"
        role="status"
      >
        {status.state === "error" || status.state === "success" ? status.message : ""}
      </p>

      <p className="text-[11px] leading-tight text-gray-400">
        By subscribing, you agree to receive occasional updates. You can unsubscribe anytime.{" "}
        <a href="/privacy" className="underline hover:opacity-80">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default MailchimpForm;