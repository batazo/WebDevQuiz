function dataSource() {
  let defaultTag = ["HTML", "CSS", "JavaScript", "PHP"];

  return [
    {
      qid: 1,
      tag: [defaultTag[0], "HTML5", "Element"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 2,
      tag: [defaultTag[0], "Element", "Attribútum kezelés"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 3,
      tag: [defaultTag[2], "Adattípus"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 4,
      tag: [defaultTag[0], "DocType"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 5,
      tag: [defaultTag[2], "Objektumkezelés", "Függvény"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 6,
      tag: [defaultTag[0], "Element", "HTML5"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 7,
      tag: [defaultTag[2]],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 8,
      tag: [defaultTag[1], "Element", "Margin"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 9,
      tag: [defaultTag[1], "Margin", "Kifejezés"],
      qDescription: "`margin: 5px 10px 3px 8px;`",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 10,
      tag: [defaultTag[0], defaultTag[2]],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 11,
      tag: [defaultTag[2], "Fetch", "API"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 12,
      tag: [defaultTag[2], "Parancs", "Műveletek"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 13,
      tag: [defaultTag[2], "Felugró ablak", "Értesítési ablak"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 14,
      tag: [defaultTag[1], "Attribútum", "Szövegformázás"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 15,
      tag: [defaultTag[1], "Attribútum", "Szövegformázás"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 16,
      tag: [defaultTag[2], "Változók"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 17,
      tag: [defaultTag[1], "Szövegformázás", "Element"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 18,
      tag: [defaultTag[2], "Tömb", "Műveletek", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "powbwgp"
    },
    {
      qid: 19,
      tag: [defaultTag[2], "Kifejezés", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "OJgXgRb"
    },
    {
      qid: 20,
      tag: [defaultTag[2], "Kifejezés", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "KKqMqWQ"
    },
    {
      qid: 21,
      tag: [defaultTag[2], "Függvény", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "eYRzRWP"
    },
    {
      qid: 22,
      tag: [defaultTag[2], "Hatókör", "Scope"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "XWgKgdx"
    },
    {
      qid: 23,
      tag: [defaultTag[2], "Tömb", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "LYLZLPv"
    },
    {
      qid: 24,
      tag: [defaultTag[2], "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "mdwERwE"
    },
    {
      qid: 25,
      tag: [defaultTag[2], "Kifejezés", "Kódértelmezés"],
      qDescription: "typeof true",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 26,
      tag: [defaultTag[2], "Kifejezés", "Kódértelmezés"],
      qDescription: "'szék' > 'ágy'",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 27,
      tag: [defaultTag[2], "Ciklus", "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "MWoeoYQ"
    },
    {
      qid: 28,
      tag: [defaultTag[2], "Vezérlési", "Szerkezet"],
      qDescription: "",
      qCode: "",
      qCodepenCode: ""
    },
    {
      qid: 29,
      tag: [defaultTag[2], "Kódértelmezés"],
      qDescription: "Kód:",
      qCode: "",
      qCodepenCode: "XWgdRBB"
    }
  ];
}

function getQuestionByQid(qid) {
  let returr = false;
  dataSource().map((data) => {
    returr = data.qid === qid ? { ...data } : returr;
  });
  return returr;
}

function findQuestionByQid(qid) {
  return dataSource().find((data) => data.qid === qid);
}
