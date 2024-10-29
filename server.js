import React, { useState } from 'react';
import './App.css';

function App() {
  const [cache, setCache] = useState([]); // L1 Cache
  const [mainMemory, setMainMemory] = useState([]);
  const [cacheHit, setCacheHit] = useState('');
  const [cacheMiss, setCacheMiss] = useState('');
  const [latency, setLatency] = useState('');
  const [writePolicy, setWritePolicy] = useState('write-through'); // 'write-through' or 'write-back'

  const CACHE_SIZE = 5; // Fixed size for L1 Cache

  const addData = (data) => {
    const startTime = performance.now();
    let hitIndex = cache.indexOf(data);

    if (writePolicy === 'write-through') {
      // Write-through: Ask if data goes to cache or main memory
      const toCache = window.confirm("Store in L1 Cache? (Cancel = Main Memory)");
      if (toCache) {
        updateCache(data);
      } else {
        setMainMemory([...mainMemory, data]);
      }
      setCacheHit('');  // No cache hit/miss shown
      setCacheMiss('');
      setLatency('');   // No latency shown
    } else if (writePolicy === 'write-back') {
      // Write-back: Show cache hit/miss and latency
      if (hitIndex !== -1) {
        setCacheHit(`Cache Hit in L1!`);
        setCacheMiss('');
        setLatency(`Latency: 10^${Math.floor(Math.log10(performance.now() - startTime))} ms`);
        // Move the hit data to the end to indicate it is recently used (LRU update)
        setCache([...cache.slice(0, hitIndex), ...cache.slice(hitIndex + 1), cache[hitIndex]]);
      } else {
        setCacheMiss('Cache Miss! Fetching from Main Memory.');
        setCacheHit('');
        const latencyFromMainMemory = performance.now() - startTime;
        setLatency(`Latency from Main Memory: 10^${Math.floor(Math.log10(latencyFromMainMemory))} ms`);
        updateCache(data);
      }
    }
  };

  const updateCache = (data) => {
    let updatedCache = [...cache];
    
    // LRU Replacement Policy: Remove least recently used if full
    if (cache.length >= CACHE_SIZE) {
      updatedCache.shift(); // Remove least recently used
    }
    
    updatedCache.push(data);
    setCache(updatedCache);
    
    if (mainMemory.includes(data)) {
      // Remove data from main memory once fetched
      setMainMemory(mainMemory.filter(item => item !== data));
    }
  };

  const handleWritePolicyChange = (policy) => {
    setWritePolicy(policy);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>L1 Cache Simulation System</h1>
      </header>

      <div className="simulation-section">
        <div className="write-policy-section">
          <label>
            <input
              type="radio"
              value="write-through"
              checked={writePolicy === 'write-through'}
              onChange={() => handleWritePolicyChange('write-through')}
            />
            Write-Through
          </label>
          <label>
            <input
              type="radio"
              value="write-back"
              checked={writePolicy === 'write-back'}
              onChange={() => handleWritePolicyChange('write-back')}
            />
            Write-Back
          </label>
        </div>
        <input
          type="text"
          placeholder="Enter data"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addData(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <div className="cache-status">
          <p style={{ color: 'green' }}>{cacheHit}</p>
          <p style={{ color: 'red' }}>{cacheMiss}</p>
          <p>{latency}</p>
        </div>
        <div className="cache-main-memory">
          <h3>L1 Cache Contents:</h3>
          <ul>
            {cache.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3>Main Memory Contents:</h3>
          <ul>
            {mainMemory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
