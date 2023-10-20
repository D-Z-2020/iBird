/* This file contains the constants for the game.

QUIZ_FULL_MARKS_REWARD_COEFFICIENT: When participants answer all the quiz questions correctly,
the reward they receive equals this constant times the rarity of the bird in that quiz.

QUIZ_CORRECT_QUESTION_REWARD_COEFFICIENT: When participants answer one quiz question correctly,
the reward they receive equals this constant times the rarity of the bird in that quiz.

BIRD_COLLECTION_CHALLANGES_BRONZE
BIRD_COLLECTION_CHALLANGES_SILVER
BIRD_COLLECTION_CHALLANGES_GOLD
The number of birds needed to be collected for each challenge level: bronze, silver, or gold.

CORRECT_QUIZZES_CHALLANGES_BRONZE
CORRECT_QUIZZES_CHALLANGES_SILVER
BCORRECT_QUIZZES_CHALLANGES_GOLD
The number of quizzes that need to be answered correctly for each challenge level: bronze, silver, or gold.

WALKING_DISTANCE_CHALLANGES_BRONZE
WALKING_DISTANCE_CHALLANGES_SILVER
WALKING_DISTANCE_CHALLANGES_GOLD
The walking distance required for each challenge level: bronze, silver, or gold.

ELEVATION_GAIN_CHALLANGES_BRONZE
ELEVATION_GAIN_CHALLANGES_SILVER
ELEVATION_GAIN_CHALLANGES_GOLD
The elevation gain required for each challenge level: bronze, silver, or gold.

DISTANCE_COEFFECIENT
The reward for every 1 meter of distance.

ELEVATION_GAIN_COEFFECIENT
The reward for every 1 meter of elevation gain.

NEW_BIRD_REWARD_COEFFECIENT
The reward for every new bird find by the player.

REPEAT_BIRD_REWARD_COEFFECIENT
The reward for repeat bird find by the player.

EXERCISE_GOAL_COEFFECIENT
This constant multiplied by the exercise goal level determines the reward when a user completes the goal.

BIRD_GOAL_COEFFECIENT
This constant multiplied by the bird-finding goal level determines the reward when a user completes the goal.

BIRD_FLOW_DURATION
If the player doesn't find any bird within this constant time in minutes, we pop up a quiz to keep them in a flow state.

BRONZE_CHALLANGE
The rewards when a player completes a bronze challenge.

SILVER_CHALLANGE
The rewards when a player completes a silver challenge.

GOLD_CHALLANGE
The rewards when a player completes a gold challenge.

RARITY_1_PROB
The probability that the bird in the pop-up quiz has a rarity of 1 when the player doesn't find any birds.

RARITY_2_PROB
The probability that the bird in the pop-up quiz has a rarity of 2 when the player doesn't find any birds.

RARITY_3_PROB
The probability that the bird in the pop-up quiz has a rarity of 3 when the player doesn't find any birds.

RARITY_4_PROB
The probability that the bird in the pop-up quiz has a rarity of 4 when the player doesn't find any birds.

RARITY_5_PROB
The probability that the bird in the pop-up quiz has a rarity of 5 when the player doesn't find any birds.

RARITY_6_PROB
The probability that the bird in the pop-up quiz has a rarity of 6 when the player doesn't find any birds.

FITNESS_ASSESSMENT_TIME
The time which we assessed the player's fitness level.

LEVEL_UP_COEFFICIENT
The scores required to level up the Kiwi from level n to level n+1 are LEVEL_UP_COEFFICIENT times n.

KIWI_STAGE2_LEVEL
KIWI_STAGE3_LEVEL
KIWI_STAGE4_LEVEL
KIWI_STAGE5_LEVEL
KIWI_STAGE6_LEVEL
The level required for the Kiwi to evolve to each stage.
*/
const QUIZ_FULL_MARKS_REWARD_COEFFICIENT = 50;
const QUIZ_CORRECT_QUESTION_REWARD_COEFFICIENT = 10;
const DISTANCE_COEFFECIENT = 0.1;
const ELEVATION_GAIN_COEFFECIENT = 1;
const NEW_BIRD_REWARD_COEFFECIENT = 1000;
const REPEAT_BIRD_REWARD_COEFFECIENT = 100;
const EXERCISE_GOAL_COEFFECIENT = 300;
const BIRD_GOAL_COEFFECIENT = 50;
const BIRD_FLOW_DURATION = 10; //in minutes
const BRONZE_CHALLANGE = 1000;
const SILVER_CHALLANGE = 10000;
const GOLD_CHALLANGE = 30000;

const RARITY_1_PROB = 50;
const RARITY_2_PROB = 20;
const RARITY_3_PROB = 15;
const RARITY_4_PROB = 10;
const RARITY_5_PROB = 3;
const RARITY_6_PROB = 2;

const FITNESS_ASSESSMENT_TIME = 15; //in minutes

const BIRD_COLLECTION_CHALLANGES_BRONZE = 5;
const BIRD_COLLECTION_CHALLANGES_SILVER = 15;
const BIRD_COLLECTION_CHALLANGES_GOLD = 25;

const CORRECT_QUIZZES_CHALLANGES_BRONZE = 10;
const CORRECT_QUIZZES_CHALLANGES_SILVER = 100;
const BCORRECT_QUIZZES_CHALLANGES_GOLD = 300;

const WALKING_DISTANCE_CHALLANGES_BRONZE = 10000;
const WALKING_DISTANCE_CHALLANGES_SILVER = 100000;
const WALKING_DISTANCE_CHALLANGES_GOLD = 300000;

const ELEVATION_GAIN_CHALLANGES_BRONZE = 1000;
const ELEVATION_GAIN_CHALLANGES_SILVER = 10000;
const ELEVATION_GAIN_CHALLANGES_GOLD = 30000;

const LEVEL_UP_COEFFICIENT = 1000;

const KIWI_STAGE2_LEVEL = 20;
const KIWI_STAGE3_LEVEL = 40;
const KIWI_STAGE4_LEVEL = 60;
const KIWI_STAGE5_LEVEL = 80;
const KIWI_STAGE6_LEVEL = 100;


module.exports = {
    QUIZ_FULL_MARKS_REWARD_COEFFICIENT,
    QUIZ_CORRECT_QUESTION_REWARD_COEFFICIENT,
    DISTANCE_COEFFECIENT,
    ELEVATION_GAIN_COEFFECIENT,
    NEW_BIRD_REWARD_COEFFECIENT,
    REPEAT_BIRD_REWARD_COEFFECIENT,
    EXERCISE_GOAL_COEFFECIENT,
    BIRD_GOAL_COEFFECIENT,
    BIRD_FLOW_DURATION,
    BRONZE_CHALLANGE,
    SILVER_CHALLANGE,
    GOLD_CHALLANGE,
    RARITY_1_PROB,
    RARITY_2_PROB,
    RARITY_3_PROB,
    RARITY_4_PROB,
    RARITY_5_PROB,
    RARITY_6_PROB,
    FITNESS_ASSESSMENT_TIME,

    BIRD_COLLECTION_CHALLANGES_BRONZE,
    BIRD_COLLECTION_CHALLANGES_SILVER,
    BIRD_COLLECTION_CHALLANGES_GOLD,

    CORRECT_QUIZZES_CHALLANGES_BRONZE,
    CORRECT_QUIZZES_CHALLANGES_SILVER,
    BCORRECT_QUIZZES_CHALLANGES_GOLD,

    WALKING_DISTANCE_CHALLANGES_BRONZE,
    WALKING_DISTANCE_CHALLANGES_SILVER,
    WALKING_DISTANCE_CHALLANGES_GOLD,

    ELEVATION_GAIN_CHALLANGES_BRONZE,
    ELEVATION_GAIN_CHALLANGES_SILVER,
    ELEVATION_GAIN_CHALLANGES_GOLD,

    LEVEL_UP_COEFFICIENT,

    KIWI_STAGE2_LEVEL,
    KIWI_STAGE3_LEVEL,
    KIWI_STAGE4_LEVEL,
    KIWI_STAGE5_LEVEL,
    KIWI_STAGE6_LEVEL,
};