const { generateFullPortfolio, generateSEOTags } = require("./openaiService");
const Portfolio = require("../models/Portfolio");

exports.generateATSResume = (portfolio) => {
    let resume = "";
    resume += `${portfolio.title.toUpperCase()}\n`;
    resume += `====================================\n\n`;

    portfolio.sections.forEach(section => {
        resume += `${section.type.toUpperCase()}\n`;
        resume += `----------------\n`;

        if (section.type === "about") {
            resume += `${section.data.content}\n\n`;
        } else if (section.type === "skills") {
            resume += `Skills: ${section.data.skills.join(", ")}\n\n`;
        } else if (section.type === "projects") {
            section.data.projects.forEach(p => {
                resume += `* ${p.name}: ${p.description}\n`;
                if (p.technologies) resume += `  Stack: ${p.technologies.join(", ")}\n`;
            });
            resume += `\n`;
        }
    });

    return resume;
};
