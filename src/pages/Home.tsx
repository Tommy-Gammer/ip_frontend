import { useState, useEffect } from 'react'

type Film = any
type Actor = any

export default function HomePage() {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)
  const [showFilms, setShowFilms] = useState(true)
  const [topFilms, setTopFilms] = useState<Film[]>([])
  const [topActors, setTopActors] = useState<Actor[]>([])

  const API_BASE = 'http://localhost:5000/api';

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  // API calls
  async function fetchData() {
    const filmsResponse = await fetch(`${API_BASE}/films/top-rented`);
    const actorsResponse = await fetch(`${API_BASE}/actors/top`);
    
    const filmsData = await filmsResponse.json();
    const actorsData = await actorsResponse.json();

    setTopFilms(filmsData);
    setTopActors(actorsData);
  }

  // Handle selecting a film
  async function handleFilmClick(film) {
    setSelectedActor(null);
    setSelectedFilm(film);
  }

  // Handle selecting an actor
  async function handleActorClick(actor) {
    setSelectedFilm(null);
    
    const response = await fetch(`${API_BASE}/actors/${actor.actor_id}`);
    const fullActor = await response.json();
    setSelectedActor(fullActor);
  }

  return (
    <div style={{ 
        margin: 0, padding: 0, width: '100%', boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <button
              onClick={() => setShowFilms(true)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: showFilms ? '#4f46e5' : 'transparent',
                color: showFilms ? 'white' : '#6b7280'
              }}
            >
              Top Movies
            </button>
            <button
              onClick={() => setShowFilms(false)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: !showFilms ? '#4f46e5' : 'transparent',
                color: !showFilms ? 'white' : '#6b7280'
              }}
            >
              Top Actors
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Left side */}
          <div>
            {showFilms && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
                  Top 5 Most Rented Films
                </h2>
                {topFilms.map((film, index) => (
                  <div
                    key={film.film_id}
                    onClick={() => handleFilmClick(film)}
                    style={{
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            marginRight: '15px'
                          }}>
                            #{index + 1}
                          </span>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {film.title}
                          </h3>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                          {film.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showFilms && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>
                  Top 5 Actors
                </h2>
                {topActors.map((actor, index) => (
                  <div
                    key={actor.actor_id}
                    onClick={() => handleActorClick(actor)}
                    style={{
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4f46e5';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: '20px',
                          marginRight: '20px'
                        }}>
                          #{index + 1}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {actor.first_name} {actor.last_name}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                            {actor.film_count} movies
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Right side */}
          <div>
            {selectedFilm && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>Movie Details</h3>
                <div>
                  <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>{selectedFilm.title}</h4>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                    {selectedFilm.description}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Year:</span>
                      <p style={{ color: '#374151', fontWeight: '600', margin: '5px 0 0 0' }}>{selectedFilm.release_year}</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Rating:</span>
                      <p style={{ color: '#374151', fontWeight: '600', margin: '5px 0 0 0' }}>{selectedFilm.rating}</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Length:</span>
                      <p style={{ color: '#374151', fontWeight: '600', margin: '5px 0 0 0' }}>{selectedFilm.length} min</p>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Category:</span>
                      <p style={{ color: '#374151', fontWeight: '600', margin: '5px 0 0 0' }}>{selectedFilm.category}</p>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: '#e0e7ff', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ color: '#374151', fontWeight: '600' }}>
                      {selectedFilm.rental_count} Total Rentals
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedActor && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>Actor Details</h3>
                <div>
                  <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    {selectedActor.first_name} {selectedActor.last_name}
                  </h4>
                  
                  <div style={{ backgroundColor: '#f3e8ff', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
                    <span style={{ color: '#7c3aed', fontWeight: '600' }}>
                      {selectedActor.film_count} Movies
                    </span>
                  </div>
                  
                  <h5 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>Top 5 Movies:</h5>
                  <div>
                    {selectedActor.top_movies.map((movie, index) => (
                      <div
                        key={movie.film_id}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e0e7ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '500', fontSize: '14px', color: '#1f2937' }}>
                            {movie.title}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>#{index + 1}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          {movie.rental_count} rentals
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}