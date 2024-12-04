import React from 'react'
import CardAnalysis from './CardAnalysis.jsx/CardAnalysis'

function AnalyticsSession() {
    
  return (
    <>
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                        <CardAnalysis></CardAnalysis>
                        <CardAnalysis></CardAnalysis>
                        <CardAnalysis></CardAnalysis>
                        <CardAnalysis></CardAnalysis>
                    </div>
    </>
        
       
    

  )
}

export default AnalyticsSession