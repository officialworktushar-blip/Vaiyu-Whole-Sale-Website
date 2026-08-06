"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Review = {
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

const FAKE_REVIEWS: Review[] = [
  {
    name: "Rajesh Kumar",
    rating: 5,
    date: "12 Jul 2026",
    title: "Excellent quality and great value",
    body: "Bought this for my retail shop and my customers are very happy with it. Build quality is solid and the wholesale pricing is unbeatable.",
    verified: true,
  },
  {
    name: "Priya Sharma",
    rating: 4,
    date: "28 Jun 2026",
    title: "Good product, fast delivery",
    body: "The product matches the description perfectly. Delivery was quick and packaging was secure. Would recommend to other resellers.",
    verified: true,
  },
  {
    name: "Amit Patel",
    rating: 5,
    date: "3 Jun 2026",
    title: "Trusted wholesale supplier",
    body: "Have been ordering from Vaiyu for months now. Consistent quality and always in stock. Highly recommended for bulk purchases.",
    verified: false,
  },
  {
    name: "Sneha Reddy",
    rating: 4,
    date: "19 May 2026",
    title: "Good value for money",
    body: "Decent product at a fair price. Works exactly as expected and the customer support team is responsive.",
    verified: true,
  },
];

const AVERAGE_RATING =
  FAKE_REVIEWS.reduce((sum, review) => sum + review.rating, 0) /
  FAKE_REVIEWS.length;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
        />
      ))}
    </div>
  );
}

export default function ProductReviews() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError("Please enter your name and a review.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="mt-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-brand-navy">Write a Review</h2>
          <p className="mt-1 text-sm text-brand-gray">
            Share your experience with this product to help other wholesalers.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-5 py-8 text-center">
              <h3 className="font-semibold text-green-700">
                Thank you for your review!
              </h3>
              <p className="mt-2 text-sm text-green-700">
                Your review has been received and will appear on the site after
                moderation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <p className="mb-1.5 text-sm font-medium text-brand-navy">
                  Your rating
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = i + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                        className="p-0.5"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            value <= (hoverRating || rating)
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-name"
                  className="mb-1.5 block text-sm font-medium text-brand-navy"
                >
                  Your name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label
                  htmlFor="review-body"
                  className="mb-1.5 block text-sm font-medium text-brand-navy"
                >
                  Your review
                </label>
                <textarea
                  id="review-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={4}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-red">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="rounded-md bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-brand-navy">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-brand-navy">
                {AVERAGE_RATING.toFixed(1)}
              </span>
              <StarRating rating={Math.round(AVERAGE_RATING)} />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {FAKE_REVIEWS.map((review) => (
              <article
                key={review.name}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-brand-gray">{review.date}</span>
                </div>
                <h3 className="mt-3 font-semibold text-brand-navy">
                  {review.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-brand-gray">
                  {review.body}
                </p>
                <p className="mt-3 text-sm font-medium text-brand-orange">
                  {review.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
