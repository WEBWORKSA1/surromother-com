/* SurroMother.com site configuration: the only file you need to edit for links, prizes and rates. */
window.SM_CONFIG = {
  /* Encoded form-relay key (reversed, then base64). The inbox address never appears as plain text in the site. */
  relay: "bW9jLmxpYW1nQDFhc2tyb3diZXc=",
  /* After the first FormSubmit activation email, paste the random alias FormSubmit gives you here (recommended). */
  formAlias: "",
  /* Supporter payment links. Paste URLs to switch the Support page from pledge mode to instant checkout.
     e.g. "https://paypal.me/yourname", "https://buy.stripe.com/xxxx", "https://www.buymeacoffee.com/you",
     "https://ko-fi.com/you", "https://rzp.io/l/xxxx", "upi://pay?pa=yourid@bank&pn=SurroMother" */
  payments: { paypal: "", stripe: "", buymeacoffee: "", kofi: "", razorpay: "", upi: "" },
  /* Monthly Family Stories Award prizes, first to third place. */
  prizes: ["US$250 gift card + featured story", "US$100 gift card", "US$50 gift card"],
  /* Reply-time promise shown after enquiries. */
  replyTime: "within 1-2 business days"
};
