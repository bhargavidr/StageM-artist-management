import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './overrides.css'


const CarouselComp = ({media}) => {

    const displayMedia = (url) => {
        const linkPart = url.split('/')[4];// Extract the "/image or /video" part
        if(linkPart == "image" ){
            return <img src={url} alt={`image`} style={{ maxHeight: '500px', width: 'auto', objectFit: 'contain' }}  />
        } else if (linkPart == "video"){
            return <ReactPlayer url={url} controls width="95%" height="480px" />
        }
      }

      
  return (
    <Carousel useKeyboardArrows showThumbs={false} dynamicHeight width="90%">
        {media ? media?.map((ele, i) => (
            <div key={i} align="center" style={{ width: '100%' }}>
            {displayMedia(ele)}
            </div>
        )) : <p>Loading media...</p>}
    </Carousel>
  )
}

export default CarouselComp