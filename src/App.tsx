import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hub from './routes/Hub'
import Lyrics from './routes/Lyrics'
import Art from './routes/Art'
import Timer from './routes/Timer'
import Callback from './routes/Callback'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/lyrics" element={<Lyrics />} />
        <Route path="/art" element={<Art />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  )
}
