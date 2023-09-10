import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButton from '../components/NavigationButton';

export default function TripOption() {
    const [isEdugaming, setIsEdugaming] = useState(true);
    const [fitnessLevel, setFitnessLevel] = useState('mid');

    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/start/trip', { state: { isEdugaming, fitnessLevel } });
    };

    return (
        <div>
            <NavigationButton path={'/start'} text={'back'}/>
            <h2>Trip Options</h2>

            <div>
                <label>
                    Include edugaming concept:
                    <input
                        type="checkbox"
                        checked={isEdugaming}
                        onChange={() => setIsEdugaming(!isEdugaming)}
                    />
                </label>
            </div>

            <div>
                Fitness Level:
                <select value={fitnessLevel} onChange={e => setFitnessLevel(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="mid">Mid</option>
                    <option value="high">High</option>
                </select>
            </div>

            <button onClick={(handleStart)}>Start</button>
        </div>
    );
}
