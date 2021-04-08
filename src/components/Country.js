import React from 'react'

export default function Country({ country }) {
    return (
        <div>
            <div className="location-box">
                <div className="location">{country.name}, {country.country}</div>
            </div>
        </div>
    )
}
