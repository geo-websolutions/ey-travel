import jwt from "jsonwebtoken";

export const generateClientFeedbackLink = (requestId) => {
  const secretKey = process.env.FEEDBACK_LINK_SECRET;

  if (!secretKey) {
    throw new Error("FEEDBACK_LINK_SECRET environment variable is not set");
  }

  // Create JWT token that expires in 7 days
  const token = jwt.sign(
    {
      requestId,
      type: "feedback-link",
    },
    secretKey,
    { expiresIn: "2d" }
  );

  // URL-safe encoding
  const encodedToken = encodeURIComponent(token);

  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://eytravelegypt.com";

  return `${baseUrl}/availability-feedback?token=${encodedToken}`;
};

export const generatePaymentSuccessLink = (requestId) => {
  const secretKey = process.env.FEEDBACK_LINK_SECRET;

  if (!secretKey) {
    throw new Error("FEEDBACK_LINK_SECRET environment variable is not set");
  }

  // Create JWT token that expires in 7 days
  const token = jwt.sign(
    {
      requestId,
      type: "payment-success-link",
    },
    secretKey,
    { expiresIn: "2d" }
  );

  // URL-safe encoding
  const encodedToken = encodeURIComponent(token);

  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://eytravelegypt.com";

  return `${baseUrl}/payment-success?token=${encodedToken}`;
};

export const verifyFeedbackToken = (token) => {
  const secretKey = process.env.FEEDBACK_LINK_SECRET;

  if (!secretKey) {
    console.error("FEEDBACK_LINK_SECRET environment variable is not set");
    return null; // Return null instead of throwing
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);

    // Ensure it's a feedback link token
    if (decoded.type !== "feedback-link" && decoded.type !== "payment-success-link") {
      console.warn("Invalid token type:", decoded.type);
      return null;
    }

    // Check if requestId exists
    if (!decoded.requestId) {
      console.warn("Token missing requestId");
      return null;
    }

    return decoded.requestId;
  } catch (error) {
    // Log specific errors but don't throw
    if (error.name === "TokenExpiredError") {
      console.warn("Feedback token expired:", error.expiredAt);
    } else if (error.name === "JsonWebTokenError") {
      console.warn("Invalid JWT token:", error.message);
    } else {
      console.error("Error verifying token:", error.message);
    }
    return null; // Always return null on error
  }
};
