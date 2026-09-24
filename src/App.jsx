import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient'

function App() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [name, setName] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // โหลดความคิดเห็นที่ได้รับการอนุมัติแล้ว
  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('feedback')
      .select('id, display_name, is_anonymous, rating, comment, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('โหลดความคิดเห็นไม่สำเร็จ:', error)
      return
    }

    setReviews(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!comment.trim()) {
      setMessage('กรุณาเขียนความคิดเห็นก่อนครับ')
      return
    }

    if (!anonymous && !name.trim()) {
      setMessage('กรุณาใส่ชื่อ หรือเลือกไม่เปิดเผยตัวตนครับ')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('feedback')
      .insert({
        display_name: anonymous ? null : name.trim(),
        is_anonymous: anonymous,
        rating,
        comment: comment.trim(),
        status: 'pending',
      })

    setLoading(false)

    if (error) {
      console.error(error)
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      return
    }

    setMessage('ส่งความคิดเห็นเรียบร้อยแล้ว 💗 รอการตรวจสอบจากทางร้านครับ')

    setName('')
    setAnonymous(false)
    setRating(5)
    setComment('')

    setTimeout(() => {
      setShowFeedback(false)
      setMessage('')
    }, 2500)
  }

  return (
    <div className="website">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span>🌸</span>
          <div>
            <h2>BIW CLEANING</h2>
            <p>COMPUTER</p>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">หน้าแรก</a>
          <a href="#about">เกี่ยวกับเรา</a>
          <a href="#reviews">ความคิดเห็น</a>
          <a href="#contact">ติดต่อเรา</a>
        </div>

        <a
          href="#feedback"
          className="nav-button"
          onClick={() => setShowFeedback(true)}
        >
          แสดงความคิดเห็น
        </a>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">

        <div className="flower flower-1">🌸</div>
        <div className="flower flower-2">🌼</div>
        <div className="flower flower-3">🌷</div>
        <div className="flower flower-4">🌸</div>

        <div className="hero-content">
          <div className="badge">
            ✨ Computer Cleaning Service
          </div>

          <h1>
            ดูแลคอมพิวเตอร์ของคุณ
            <br />
            <span>ให้สะอาดเหมือนใหม่</span> 💻
          </h1>

          <p>
            BIW CLEANING COMPUTER
            <br />
            บริการทำความสะอาดคอมพิวเตอร์
            พร้อมรับฟังความคิดเห็นจากลูกค้าทุกคน
          </p>

          <div className="hero-buttons">
            <a
              href="#feedback"
              className="primary-button"
              onClick={() => setShowFeedback(true)}
            >
              💬 แสดงความคิดเห็น
            </a>

            <a href="#reviews" className="secondary-button">
              ⭐ ดูความคิดเห็น
            </a>
          </div>
        </div>

        <div className="computer-card">
          <div className="computer-icon">💻</div>
          <div className="sparkle sparkle-1">✦</div>
          <div className="sparkle sparkle-2">✦</div>
          <div className="sparkle sparkle-3">✧</div>
        </div>

      </section>

      {/* Services */}
      <section className="services">
        <div className="section-title">
          <span>🌷</span>
          <h2>บริการของเรา</h2>
          <p>ใส่ใจคอมพิวเตอร์ของคุณในทุกรายละเอียด</p>
        </div>

        <div className="service-grid">

          <div className="service-card">
            <div className="service-icon pink">🧹</div>
            <h3>ทำความสะอาด</h3>
            <p>
              ทำความสะอาดฝุ่นและสิ่งสกปรก
              ภายในคอมพิวเตอร์อย่างละเอียด
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon blue">❄️</div>
            <h3>ดูแลระบบระบายความร้อน</h3>
            <p>
              ตรวจสอบและดูแลระบบระบายความร้อน
              เพื่อให้คอมพิวเตอร์ทำงานได้ดี
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon green">✨</div>
            <h3>ดูแลเครื่องอย่างใส่ใจ</h3>
            <p>
              ให้บริการด้วยความระมัดระวัง
              และใส่ใจในทุกขั้นตอน
            </p>
          </div>

        </div>
      </section>

      {/* Feedback */}
      <section className="feedback-section" id="feedback">

        <div className="feedback-box">

          <div className="feedback-decoration">🌸</div>

          <span className="small-title">
            💗 YOUR FEEDBACK MATTERS
          </span>

          <h2>
            ความคิดเห็นของคุณ
            <br />
            <span>มีความหมายกับเรา</span>
          </h2>

          <p>
            หลังใช้บริการ BIW CLEANING COMPUTER
            <br />
            สามารถแบ่งปันความคิดเห็นหรือประสบการณ์ของคุณกับเราได้
          </p>

          <button
            className="feedback-button"
            onClick={() => setShowFeedback(true)}
          >
            💬 เขียนความคิดเห็น
          </button>

          <div className="anonymous">
            🔒 สามารถเลือกแสดงความคิดเห็นแบบไม่เปิดเผยตัวตนได้
          </div>

        </div>

      </section>

      {/* Reviews */}
      <section className="reviews" id="reviews">

        <div className="section-title">
          <span>⭐</span>
          <h2>ความคิดเห็นจากลูกค้า</h2>
          <p>ทุกความคิดเห็นช่วยให้เราพัฒนาบริการให้ดีขึ้น</p>
        </div>

        <div className="review-grid">

          {reviews.length === 0 ? (
            <div className="review-card">
              <div className="stars">☆☆☆☆☆</div>
              <p>
                ยังไม่มีความคิดเห็นที่ได้รับการอนุมัติ
                <br />
                เป็นคนแรกที่แบ่งปันความคิดเห็นกับเราได้เลย 💗
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div className="review-card" key={review.id}>

                <div className="stars">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>

                <p>
                  “{review.comment}”
                </p>

                <div className="review-name">
                  {review.is_anonymous
                    ? '🌸 ลูกค้าท่านหนึ่ง'
                    : `👤 ${review.display_name}`}
                </div>

              </div>
            ))
          )}

        </div>

      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="footer-logo">
          🌸 BIW CLEANING COMPUTER
        </div>

        <p>
          Computer Cleaning Service
        </p>

        <div className="footer-line"></div>

        <small>
          © 2026 BIW CLEANING COMPUTER. All rights reserved.
        </small>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && (
        <div
          className="feedback-modal"
          onClick={() => setShowFeedback(false)}
        >
          <div
            className="feedback-form"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-button"
              onClick={() => setShowFeedback(false)}
            >
              ×
            </button>

            <div className="form-flower">🌸</div>

            <h2>เขียนความคิดเห็น</h2>

            <p className="form-subtitle">
              ความคิดเห็นของคุณมีความหมายกับเรา 💗
            </p>

            <form onSubmit={handleSubmit}>

              <label>คุณต้องการให้แสดงชื่อหรือไม่?</label>

              <div className="anonymous-options">

                <label>
                  <input
                    type="radio"
                    checked={!anonymous}
                    onChange={() => setAnonymous(false)}
                  />
                  เปิดเผยชื่อ
                </label>

                <label>
                  <input
                    type="radio"
                    checked={anonymous}
                    onChange={() => setAnonymous(true)}
                  />
                  ไม่เปิดเผยตัวตน
                </label>

              </div>

              {!anonymous && (
                <>
                  <label htmlFor="name">ชื่อ</label>

                  <input
                    id="name"
                    type="text"
                    placeholder="ชื่อของคุณ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </>
              )}

              <label>ให้คะแนนบริการ</label>

              <div className="rating-input">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={star <= rating ? 'star active' : 'star'}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}

              </div>

              <label htmlFor="comment">
                ความคิดเห็น
              </label>

              <textarea
                id="comment"
                placeholder="เขียนความคิดเห็นของคุณ..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={5}
              />

              {message && (
                <div className="form-message">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="submit-feedback"
                disabled={loading}
              >
                {loading
                  ? 'กำลังส่ง...'
                  : '💗 ส่งความคิดเห็น'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default App