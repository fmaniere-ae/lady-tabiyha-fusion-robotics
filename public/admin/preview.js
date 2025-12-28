const { h } = window;

/* =========================
   Section renderers
========================= */

const AboutSection = ({ section }) =>
  h("section", { className: "py-12 border-b" }, [
    h("h2", { className: "text-2xl font-bold mb-4" }, section.title),
    h("p", { className: "mb-4" }, section.presentation),
    h("div", { className: "bg-white p-4 rounded shadow" }, [
      h("h3", { className: "font-semibold mb-2" }, "Notre vision"),
      h("p", null, section.vision),
    ]),
  ]);

const BenefitsSection = ({ section }) =>
  h("section", { className: "py-12 border-b" }, [
    h("h2", { className: "text-2xl font-bold mb-6" }, section.title),
    h(
      "ul",
      { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" },
      section.benefits?.map(b =>
        h(
          "li",
          { className: "bg-gray-100 p-4 rounded shadow-sm" },
          b
        )
      )
    ),
    h(
      "a",
      {
        href: section.cta_link,
        className:
          "inline-block bg-indigo-600 text-white px-4 py-2 rounded",
      },
      section.cta_text
    ),
  ]);

const ProgramSection = ({ section }) =>
  h("section", { className: "py-12 border-b" }, [
    h("h2", { className: "text-2xl font-bold mb-6" }, section.title),
    h(
      "div",
      { className: "grid md:grid-cols-2 gap-6" },
      section.levels?.map(level =>
        h("div", { className: "bg-white p-4 rounded shadow" }, [
          h("h3", { className: "font-semibold text-lg mb-2" }, level.name),
          h("p", null, h("strong", null, "Parcours : "), level.parcours),
          h("p", null, h("strong", null, "Projets : "), level.projets),
        ])
      )
    ),
  ]);

const PracticalSection = ({ section }) =>
  h("section", { className: "py-12" }, [
    h("h2", { className: "text-2xl font-bold mb-6" }, section.title),
    h("p", { className: "mb-2" }, section.organisation),
    h("p", null, section.safety),
  ]);

/* =========================
   Dispatcher
========================= */

function renderSection(section) {
  switch (section.type) {
    case "about":
      return AboutSection({ section });
    case "benefits":
      return BenefitsSection({ section });
    case "program":
      return ProgramSection({ section });
    case "practical":
      return PracticalSection({ section });
    default:
      return null;
  }
}

/* =========================
   Page Preview
========================= */

const HomePreview = ({ entry }) => {
  const data = entry.getIn(["data"]);
  const sections = data.get("sections")?.toJS() || [];

  return h("main", { className: "p-6 bg-gray-50 min-h-screen" }, [
    h(
      "h1",
      { className: "text-3xl font-extrabold mb-10 text-indigo-600" },
      data.get("title")
    ),
    sections.map(section => renderSection(section)),
  ]);
};

/* =========================
   Register
========================= */

CMS.registerPreviewTemplate("home", HomePreview);
