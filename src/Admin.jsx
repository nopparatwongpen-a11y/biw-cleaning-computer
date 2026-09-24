import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import './Admin.css'

function Admin() {
  const [session, setSession] = useState(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const { data } = await supabase.auth.getSession()

    setSession(data.session)

    if (data.session) {
      loadFeedback()
    }
  }

  async function handleLogin(e) {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    setLoading(false)

    if (error) {
      setMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      return
    }

    setSession(data.session)
    setEmail('')
    setPassword('')

    loadFeedback()
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    setSession(null)
    setFeedback([])
  }

  async function loadFeedback() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error)
      setMessage('ไม่สามารถโหลดความคิดเห็นได้')
      return
    }

    setFeedback(data || [])
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error(error)
      setMessage('ไม่สามารถเปลี่ยนสถานะได้')
      return
    }

    loadFeedback()
  }

  async function deleteFeedback(id) {
    const confirmed = window.confirm(
      'คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      setMessage('ไม่สามารถลบความคิดเห็นได้')
      return
    }

    loadFeedback()
  }

  /* =========================
     Login
  ========================= */

  if (!session) {
    return (
      <div className="admin-page">
        <div className="admin-login">

          <div className="admin-flower">
            🌸
          </div>

          <h1>
            BIW CLEANING
          </h1>

          <p className="admin-title">
            ADMIN PANEL
          </p>

          <p className="admin-subtitle">
            เข้าสู่ระบบจัดการความคิดเห็น
          </p>

          <form onSubmit={handleLogin}>

            <label>
              อีเมล
            </label>

            <input
              type="email"
              placeholder="อีเมล Admin"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>
              รหัสผ่าน
            </label>

            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {message && (
              <div className="admin-error">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'กำลังเข้าสู่ระบบ...'
                : '🔐 เข้าสู่ระบบ'}
            </button>

          </form>

          <a
            href="/"
            className="back-home"
          >
            ← กลับหน้าเว็บไซต์
          </a>

        </div>
      </div>
    )
  }

  /* =========================
     Admin Dashboard
  ========================= */

  const pendingCount = feedback.filter(
    (item) => item.status === 'pending'
  ).length

  const approvedCount = feedback.filter(
    (item) => item.status === 'approved'
  ).length

  const hiddenCount = feedback.filter(
    (item) => item.status === 'hidden'
  ).length

  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <div>
          <div className="admin-logo">
            🌸 BIW CLEANING COMPUTER
          </div>

          <p>
            ระบบจัดการความคิดเห็น
          </p>
        </div>

        <div className="admin-header-buttons">

          <a
            href="/"
            className="view-site"
          >
            🌐 ดูเว็บไซต์
          </a>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            ออกจากระบบ
          </button>

        </div>

      </header>

      <main className="admin-content">

        <div className="admin-heading">

          <div>
            <h1>
              ความคิดเห็นจากลูกค้า
            </h1>

            <p>
              ตรวจสอบและจัดการความคิดเห็นก่อนเผยแพร่
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadFeedback}
          >
            🔄 รีเฟรช
          </button>

        </div>

        <div className="stats">

          <div className="stat-card pending">
            <span>🕐</span>
            <div>
              <strong>{pendingCount}</strong>
              <p>รอตรวจสอบ</p>
            </div>
          </div>

          <div className="stat-card approved">
            <span>✅</span>
            <div>
              <strong>{approvedCount}</strong>
              <p>อนุมัติแล้ว</p>
            </div>
          </div>

          <div className="stat-card hidden">
            <span>🙈</span>
            <div>
              <strong>{hiddenCount}</strong>
              <p>ซ่อนอยู่</p>
            </div>
          </div>

          <div className="stat-card total">
            <span>💬</span>
            <div>
              <strong>{feedback.length}</strong>
              <p>ทั้งหมด</p>
            </div>
          </div>

        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        <div className="feedback-list">

          {feedback.length === 0 ? (

            <div className="empty-feedback">
              🌸
              <h2>
                ยังไม่มีความคิดเห็น
              </h2>

              <p>
                เมื่อมีลูกค้าส่งความคิดเห็น
                จะแสดงที่นี่
              </p>
            </div>

          ) : (

            feedback.map((item) => (

              <div
                className="admin-feedback-card"
                key={item.id}
              >

                <div className="feedback-card-top">

                  <div>

                    <div className="customer-name">

                      {item.is_anonymous
                        ? '🌸 ลูกค้าท่านหนึ่ง'
                        : `👤 ${item.display_name}`}

                    </div>

                    <div className="admin-stars">

                      {'★'.repeat(item.rating)}

                      {'☆'.repeat(
                        5 - item.rating
                      )}

                    </div>

                  </div>

                  <div
                    className={`status ${item.status}`}
                  >
                    {item.status === 'pending' &&
                      '🕐 รอตรวจสอบ'}

                    {item.status === 'approved' &&
                      '✅ อนุมัติแล้ว'}

                    {item.status === 'hidden' &&
                      '🙈 ซ่อนอยู่'}
                  </div>

                </div>

                <div className="feedback-comment">
                  “{item.comment}”
                </div>

                <div className="feedback-date">
                  {new Date(
                    item.created_at
                  ).toLocaleString('th-TH')}
                </div>

                <div className="feedback-actions">

                  {item.status !== 'approved' && (
                    <button
                      className="approve-button"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          'approved'
                        )
                      }
                    >
                      ✓ อนุมัติ
                    </button>
                  )}

                  {item.status !== 'hidden' && (
                    <button
                      className="hide-button"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          'hidden'
                        )
                      }
                    >
                      🙈 ซ่อน
                    </button>
                  )}

                  {item.status !== 'pending' && (
                    <button
                      className="pending-button"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          'pending'
                        )
                      }
                    >
                      ↩ รอตรวจสอบ
                    </button>
                  )}

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteFeedback(item.id)
                    }
                  >
                    🗑️ ลบ
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  )
}

export default Admin