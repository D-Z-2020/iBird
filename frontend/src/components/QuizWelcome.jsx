import React from 'react'
import { useNavigator } from '../hooks/useNavigator'
import {Button} from 'antd-mobile'
import './QuizWelcome.css';

export default function QuizWelcome({ quizData, onAccept, onReject }) {
    const navigateWithState = useNavigator();

    return (
        <div className="quiz-welcome-container">
            {quizData.isFlowHelper ?
                <p className="quiz-description">Looks like you haven't find any bird for a while, answering this quiz correctly will reward you <span onClick={() => navigateWithState(`/bird/${quizData.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    {quizData.birdName}</span> (rarity={quizData.birdRarity})!</p>
                :
                <p className="quiz-description">Conguradulation! You just found <span onClick={() => navigateWithState(`/bird/${quizData.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    {quizData.birdName}</span> (rarity={quizData.birdRarity})! You have got the reward for that, but answering this quiz will give you extra scores!</p>
            }
            <Button className="quiz-button" color='primary' onClick={onAccept}>Start the Quiz</Button>
            <Button className="quiz-button" color='primary' onClick={onReject}>Not Interested</Button>
        </div>
    )
}
