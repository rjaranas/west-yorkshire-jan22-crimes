    import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


        
        const dataPromise = d3.json('json/west-yorkshire-dataset.json')
        

        function drawData(dataset) {

        const width = 1200
        const height = 800

        const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', '0')

        
        const titleContainer = d3.select('body')
        .append('div')
        .attr('id', 'title-container')

        titleContainer.append('h1')
        .text('Types of Crimes in West Yorkshire')

        titleContainer.append('h3')
        .text('The amount of crimes reported to the police in West Yorkshire during January 2022')

        titleContainer.append('a')
        .text('Click here to find this dataset and other things related')
        .attr('href', 'https://data.police.uk/')
        .attr('target', '_blank')

        const container = d3.select('body')
        .append('div')
        .attr('class', 'container')
        .attr('id', 'container')
        
        const svg = container.append('svg')
        .attr('width', width + 200)
        .attr('height', height + 600)
        .attr('viewbox', [0, 0, width, height])
        .attr('transform', `translate(0, 0)`)

        const gCell = svg.append('g')
        .attr('transform', `translate(90, 0)`)
        


        const crimeCounts = d3.rollup(dataset, (v) => v.length, (d) => d['Crime type'])
        const uniqueCrimes = Array.from(crimeCounts.keys())
        const crimeData = uniqueCrimes.map((crimeType) => ({
            'Crime type': crimeType,
            'Count': crimeCounts.get(crimeType),
        }))

        crimeData.sort((a, b) => b.Count - a.Count)

        const colourScale = d3.scaleOrdinal()
        .domain(crimeData.map((d) => d['Crime type']))
        .range(d3.schemeCategory10)

    

        const xScale = d3.scaleBand()
        .domain(crimeData.map((d) => d['Crime type']))
        .range([0, width - 40])
        .padding(0.1)

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(crimeData, (d) => d.Count) + 1000])
        .range([height - 40, 0])

        gCell.selectAll('rect')
        .data(crimeData)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d['Crime type']) + 15)
        .attr('y', (d) => yScale(d.Count))
        .attr('width', xScale.bandwidth() - 30)
        .attr('height', (d) => height - 40 - yScale(d.Count))
        .attr('fill', (d) => colourScale(d['Crime type']))
        .on('mouseover', (event, d) => {
            const count = d.Count
            const type = d['Crime type']

            tooltip.transition(50)
            .duration(50)
            .style('opacity', '0.9')
            tooltip.html(`Crime: ${type}<br>Amount: ${count}`)
        })
        .on('mousemove', function() {
            tooltip.style('top', (event.pageY-100)+'px')
            .style('left', (event.pageX+40)+'px')
        })
        .on('mouseout', function (event, d) {
            tooltip.transition()
            .duration(50)
            .style('opacity', '0')
        })

        gCell.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - 40})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)')
        .attr('font-size', '14px')
        .attr('font-weight','bold')


        gCell.append('g')
        .attr('id', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(10))
        .selectAll('text')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')


        
       
       }

        
        dataPromise.then(function(data) {
        const dataset = data;
        drawData(dataset)
       })