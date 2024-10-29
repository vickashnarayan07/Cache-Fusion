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

  const addData = async (data) => {
    const startTime = performance.now();
    let hitIndex = cache.indexOf(data);

    if (writePolicy === 'write-through') {
      const toMemory = window.confirm('Write to main memory? (Cancel = Write to L1 Cache)');
      if (toMemory) {
        // Write to main memory
        setMainMemory(prevMemory => [...prevMemory, data]);
        setCacheHit('');
        setCacheMiss('');
        setLatency('');
      } else {
        // Write to L1 cache with LRU policy
        updateCache(data);
        setCacheHit('');
        setCacheMiss('');
        setLatency('');
      }
    } else if (writePolicy === 'write-back') {
      if (hitIndex !== -1) {
        // Cache hit in L1
        setCacheHit(`Cache Hit in L1!`);
        setCacheMiss('');
        const latencyDuration = performance.now() - startTime;
        setLatency(`Latency: 10^${Math.floor(Math.log10(latencyDuration))} ms`);
        // Move the hit data to the end to indicate it's recently used (LRU policy)
        setCache([...cache.slice(0, hitIndex), ...cache.slice(hitIndex + 1), cache[hitIndex]]);
      } else {
        // Cache miss, fetch from Main Memory
        setCacheMiss('Cache Miss! Fetching from Main Memory(IF DATA IS PRESENT/NOT).');
        setCacheHit('');
        const latencyDuration = performance.now() - startTime;
        setLatency(`Latency: 10^${Math.floor(Math.log10(latencyDuration))} ms`);
        updateCache(data);
      }
    }
  };

  const updateCache = (data) => {
    let updatedCache = [...cache];

    // LRU Replacement Policy: Remove least recently used if full
    if (cache.length >= CACHE_SIZE) {
      updatedCache.shift(); // Remove least recently used (first element)
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
    setCacheHit('');
    setCacheMiss('');
    setLatency('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cache Fusion</h1>
      </header>

      <div className="content-section">
        <h2>Cache vs Main Memory</h2>
        <p>Cache is a small, fast memory that stores frequently accessed data to reduce the time it takes for the CPU to retrieve it. Main memory (RAM) is larger but slower and holds all the data and programs in use.</p>
        <h2>Write Policies (Write-Through vs Write-Back)</h2>
        <p>
          <strong>Write-through:</strong> Data is written to both the cache and main memory of our choice.
          <br />
          <strong>Write-back:</strong> Data is retrieved and if it is found in cache , it will indicate CACHE HIT , if not Data will be retrieved from Main Memory after showing CACHE MISS.
        </p>
        <h2>Least Recently Used(LRU)</h2>
        <p>An LRU (Least Recently Used) cache is a type of data structure that removes the least recently accessed items when the cache reaches its limit, ensuring that frequently used data remains available. </p>
      </div>

      <div className="simulation-section">
        <h2>Simulation</h2>
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
          <h3>Cache Contents (Max {CACHE_SIZE} items):</h3>
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
