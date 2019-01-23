
import questionsList from '../models/questions.json';

const questions = ((typeof (questionsList) !== 'object') ? [] : questionsList);

export default questions;