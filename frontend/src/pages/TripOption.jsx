import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButton from '../components/NavigationButton';

// This page allows the user to select goals for a new trip.
export default function TripOption() {
    const [isEdugaming, setIsEdugaming] = useState(true);
    const [level, setLevel] = useState('1000 meters');

    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/start/trip', { state: { isEdugaming, level } });
    };

    return (
        <div>
            <NavigationButton path={'/start'} text={'Trip Options'} />

            <main  className='Trip_option_box'>
                {/* Edugaming option */}
                <div className='cloumn'>
                    <label htmlFor="checkbox">
                        I want to go bird watching!      </label>
                        <p>
                            <input
                                id="checkbox"
                                type="checkbox"
                                checked={isEdugaming}
                                onChange={() => setIsEdugaming(!isEdugaming)}
                            />
                        </p>
                        
              
                </div>

                {/* Level selection */}
                <div className='cloumn'>
                    <label htmlFor="level">Level:</label>
                    <p>
                        <select id="level" value={level} onChange={e => setLevel(e.target.value)}>
                            <option value="1000 meters">1000 meters</option>
                            <option value="2000 meters">2000 meters</option>
                            <option value="3000 meters">3000 meters</option>
                            <option value="4000 meters">4000 meters</option>
                            <option value="5000 meters">5000 meters</option>
                            <option value="6000 meters">6000 meters</option>
                            <option value="7000 meters">7000 meters</option>
                            <option value="8000 meters">8000 meters</option>
                        </select>
                    </p>
              
                </div>

                <div className='Round_button'>
                    <button  onClick={(handleStart)}>Start</button>
                </div>
            </main>
          
        </div>
    );
}
