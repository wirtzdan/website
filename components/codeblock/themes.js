const prismLight = {
  plain: {
    color: "#4A5568",
    backgroundColor: "white",
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "rgb(162, 191, 252)",
        fontStyle: "italic",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "rgba(239, 83, 80, 0.56)",
        fontStyle: "italic",
      },
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "rgb(72, 118, 214)",
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#A0AEC0",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "builtin", "char", "constant", "url"],
      style: {
        color: "#3182CE",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#F59E0B",
      },
    },
    {
      types: ["number"],
      style: {
        color: "#DD6B20",
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "#805AD5",
      },
    },
    {
      types: ["function", "selector", "doctype"],
      style: {
        color: "#3182CE",
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "rgb(17, 17, 17)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "#805AD5",
      },
    },
    {
      types: ["operator", "property", "keyword", "namespace"],
      style: {
        color: "#319795",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "rgb(188, 84, 84)",
      },
    },
  ],
};

const prismDark = {
  plain: {
    color: "#F7FAFC",
    backgroundColor: "#1A202C",
  },
  styles: [
    {
      types: ["changed"],
      style: {
        color: "rgb(162, 191, 252)",
        fontStyle: "italic",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "rgba(239, 83, 80, 0.56)",
        fontStyle: "italic",
      },
    },
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "rgb(72, 118, 214)",
        fontStyle: "italic",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#A0AEC0",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "builtin", "char", "constant", "url"],
      style: {
        color: "#90CDF4",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "#F59E0B",
      },
    },
    {
      types: ["number"],
      style: {
        color: "#DD6B20",
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ["punctuation"],
      style: {
        color: "#E9D8FD",
      },
    },
    {
      types: ["function", "selector", "doctype"],
      style: {
        color: "#90CDF4",
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#90CDF4",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "#D6BCFA",
      },
    },
    {
      types: ["operator", "property", "keyword", "namespace"],
      style: {
        color: "#81E6D9",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "rgb(188, 84, 84)",
      },
    },
  ],
};

export { prismDark, prismLight };
