'use client';

interface WelcomePageProps {
  onOpen: () => void;
  guestName: string | null;
}

export default function WelcomePage({ onOpen, guestName }: WelcomePageProps) {
  return (
    <div className="loading-page bg-white-black d-flex justify-content-center align-items-center" style={{ opacity: 1 }}>
      <div className="d-flex flex-column text-center overflow-y-auto vh-100 justify-content-center align-items-center">
        <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>The Wedding Of</h2>
        
        <img
          src="/assets/images/bg.webp"
          alt="background"
          className="img-center-crop rounded-circle border border-3 border-light shadow mb-4 mx-auto"
        />
        
        <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>Wahyu & Riski</h2>
        
        {guestName && (
          <div id="guest-name" className="mb-2">
            <small className="d-block mt-0 mb-1 mx-0 p-0">Kepada Yth Bapak/Ibu/Saudara/i</small>
            <p className="m-0 p-0" style={{ fontSize: '1.25rem' }}>{guestName}</p>
          </div>
        )}
        
        <button
          onClick={onOpen}
          type="button"
          className="btn btn-light shadow rounded-4 mt-3 mx-auto"
        >
          <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>
          Open Invitation
        </button>
      </div>
    </div>
  );
}
