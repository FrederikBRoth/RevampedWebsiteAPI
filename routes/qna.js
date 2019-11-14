const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Answer = require("../models/Answer");

router.get("/", (req, res) => {
	res.send("this is a question");
});

router.post("/postquestion", async (req, res) => {
	const question = new Question({
		question: req.body.question
	});
	const savedQuestion = await question.save();
	res.send(savedQuestion);
});
router.post("/postanswer", async (req, res) => {
	const answer = new Answer({
		answer: req.body.answer,
		sender: req.body.sender
	});
	const savedAnswer = await answer.save();
	res.send(savedAnswer);
});
router.get("/getquestions", async (req, res) => {
	const questionList = await Question.find();
	res.send(questionList);
});

module.exports = router;
