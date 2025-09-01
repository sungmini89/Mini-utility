const mockZxcvbn = jest.fn().mockImplementation((password: string) => {
  // Simple logic to return different scores based on password
  let score = 0;
  let suggestions: string[] = [];

  if (password.length < 8) {
    score = 0;
    suggestions = ["Make it longer"];
  } else if (password.length < 12) {
    score = 1;
    suggestions = ["Add more characters"];
  } else if (password.length < 16) {
    score = 2;
    suggestions = ["Good length"];
  } else if (password.length < 20) {
    score = 3;
    suggestions = ["Very good length"];
  } else {
    score = 4;
    suggestions = ["Excellent length"];
  }

  // Add complexity suggestions
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters");
  }
  if (!/\d/.test(password)) {
    suggestions.push("Add numbers");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push("Add special characters");
  }

  return {
    score,
    feedback: {
      warning: score < 2 ? "This password is too weak" : null,
      suggestions,
    },
    crack_times_display: {
      offline_slow_hashing_1e4_per_second:
        score < 2 ? "seconds" : score < 3 ? "minutes" : "centuries",
      offline_fast_hashing_1e10_per_second:
        score < 2 ? "seconds" : score < 3 ? "minutes" : "centuries",
    },
  };
});

export default mockZxcvbn;
