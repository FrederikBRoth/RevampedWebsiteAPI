const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const { answerValidation } = require("../interfaces/validate");
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
	const { error } = answerValidation(req.body);
	if (error) {
		res.statusMessage = error.details[0].message;
		return res.status(400).end();
	}
	const answer = new Answer({
		answer: req.body.answer,
		sender: req.body.sender,
		questionId: req.body.questionId
	});
	const savedAnswer = await answer.save();
	res.send(savedAnswer);
});
router.get("/getquestions", async (req, res) => {
	const questionList = await Question.find();
	res.send(questionList);
});
router.get("/getanswers", async (req, res) => {
	const answerList = await Answer.find();
	res.send(answerList);
});

module.exports = router;
