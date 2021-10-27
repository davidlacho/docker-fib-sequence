import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Fib = () => {
    const [seenIndexes, setseenIndexes] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, []);

    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        setValues(values.data);
    }

    const fetchIndexes = async () => {
        const seenIndexes = await axios.get('/api/values/all');
        setseenIndexes(seenIndexes.data)
    }

    const renderSeenIndexes = () => {
        return seenIndexes.map(({number}) => number).join(', ')
    }

    const renderValues = () => {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            )
        }
        return entries;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/values', {
            index: index
        })
        setIndex('')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={index}
                    onChange={e => setIndex(e.target.value)}
                />
                <button>Submit</button>
            </form>
            <h3>Indexes I have Seen:</h3>
            {renderSeenIndexes()}
            <h3>Calculated Values:</h3>
            {renderValues()}
        </div>
    )

}

export default Fib;