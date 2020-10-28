let countyDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
       canvas.selectAll('path')
             .data(countyData)
             .enter()
             .append('path')
             .style('cursor', 'grab')
             .attr('d', d3.geoPath())
             .attr('class', 'county')
             .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if(percentage <= 15){
                    return "rgb(199, 233, 192)"
                }else if(percentage <= 30){
                    return "rgb(161, 217, 155)"
                }else if(percentage <= 45){
                    return "rgb(116, 196, 118)"
                }else{
                    return "rgb(65, 171, 93)"
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'visible')
               

                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                    })
                tooltip.text(county['area_name'] + ", " + county['state'] + ': ' + county['bachelorsOrHigher'] + "%")

                tooltip.attr('data-education', county['bachelorsOrHigher'])
            })

            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                .style('visibility', 'hidden')
            })

}

d3.json(countyDataURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features

            d3.json(educationDataURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        drawMap()
                    }
                }
            )
        }
    }
)