export const socialCardAlt =
  'Workflow automation and systems consulting for businesses that need less manual work'

export function SocialCard() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.18), transparent 24%), linear-gradient(180deg, #020617 0%, #0f172a 48%, #111827 100%)',
        color: '#e2e8f0',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          opacity: 0.35,
        }}
      />

      <div
        style={{
          display: 'flex',
          width: '100%',
          padding: '56px 64px',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '58%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#93c5fd',
                fontSize: '22px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '999px',
                  background: '#38bdf8',
                  boxShadow: '0 0 18px rgba(56,189,248,0.45)',
                }}
              />
              dbraun.io
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '70px',
                  fontWeight: 700,
                  lineHeight: 1.02,
                  color: '#f8fafc',
                  display: 'flex',
                }}
              >
                Workflow Automation Consulting
              </div>
              <div
                style={{
                  fontSize: '28px',
                  color: '#cbd5e1',
                  lineHeight: 1.25,
                  display: 'flex',
                }}
              >
                Systems that remove manual work and hold up after launch.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {['Lead Automation', 'System Integration', 'Operational Software'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    padding: '12px 18px',
                    borderRadius: '999px',
                    border: '1px solid rgba(147,197,253,0.25)',
                    background: 'rgba(37,99,235,0.10)',
                    color: '#dbeafe',
                    fontSize: '22px',
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            width: '42%',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            padding: '26px',
            borderRadius: '32px',
            border: '1px solid rgba(148,163,184,0.18)',
            background: 'rgba(2,6,23,0.72)',
            boxShadow: '0 24px 80px -36px rgba(2,6,23,0.9)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '18px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#93c5fd',
              }}
            >
              System Architecture
            </div>
            <div
              style={{
                display: 'flex',
                padding: '8px 14px',
                borderRadius: '999px',
                background: 'rgba(16,185,129,0.12)',
                color: '#a7f3d0',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              systems first
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              ['Ingest', 'voice, forms, uploads'],
              ['Orchestrate', 'queues, routing, policy'],
              ['AI Layer', 'retrieval, generation, validation'],
              ['Deliver', 'dashboards, exports, workflows'],
            ].map(([title, detail], index) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '34px',
                    height: '34px',
                    borderRadius: '999px',
                    background: 'rgba(59,130,246,0.16)',
                    color: '#bfdbfe',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(148,163,184,0.14)',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#f8fafc',
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '16px',
                      color: '#94a3b8',
                    }}
                  >
                    {detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              borderRadius: '24px',
              border: '1px solid rgba(148,163,184,0.14)',
              background: 'rgba(15,23,42,0.88)',
              padding: '18px 20px',
              fontSize: '18px',
              color: '#cbd5e1',
            }}
          >
            problem - system - outcome
          </div>
        </div>
      </div>
    </div>
  )
}
