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
                <p className="quiz-description">Congratulations! You just found <span onClick={() => navigateWithState(`/bird/${quizData.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    {quizData.birdName}</span> (rarity={quizData.birdRarity})! You have received scores for that, but answering this quiz will give you extra scores! <b>Feel free to click on the bird's name to view information before attempting this quiz!</b></p>
            }
            <Button className="quiz-button" color='primary' onClick={onAccept}>Start the Quiz</Button>
            <Button className="quiz-button" color='primary' onClick={onReject}>Not Interested</Button>
        </div>
    )
}
