Link to the work-in-progress pen right [here]().

# Preface

For the second project in the data visualization certification, on the @freecodecamp curriculum, the task is to create a scatter plot, with information regarding cycling records displayed according to the year of the record and the time of the actual time of the record itself.

## Data

The data is provided in the following [URL](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json):

```
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json
```

A query to te URL returns a JSON object, with pertinent information in the following fields:

- Time, the time in minutes and seconds taken to accomplish the analysed cycling circuit;

- Seconds, the same time, but exclusively in seconds;
- Name, the first and last name of the rider;
- Year, the four digit time frame in which the record was registered;
- Nationality, a three-letter abbreviation for the country of origin;
- Doping, a string describing possible doping allegations. This can be an empty string if no doping allegations are connected to the circuit/rider;
- URL, a reference to a source describing the doping allegation. This too can be an empty string, under the same assumption of the previous field.

The keys here described are catalogued in objects. The object themselves are nested in yet an array, which groups them all together.

To access a single key it is therefore necessary to target the different objects and later their fields, through dot or bracket notation, as with the following example:

```JS
const highestScoreBracket = jsonObj[0]["Time"];
const highestScoreDot = jsonObj[0].Time;
```

**Important Note**

The dataset is sorted according to the time took to complete the circuit under analysis, not according to the year in which the record was registered. 

## Scatter Plot

Based on the mentioned considerations, the scatter plot is set to analyse the records by describing the year of the records on the horizontal axis, and the actual time behind the record on the vertical axis.

Each dot in the graph will have an x and y coordinate according to these values.

Additional information such as doping allegations and name of the rider are to be displayed with other elements. Doping allegations, as seen in the example referenced by freeCodeCamp, can be included through a different value of properties like `fill` or `stroke`. The name of the rider, with perhaps additional tidbits of information like nationality, can be included in a tooltip.

## User Stories

In order to consider the project as valid, freeCodeCamp specifies a series of user stories the scatter plot must fulfill. These help guide the development, but also place a few constraints on the code base. 

- [ ] there exist a title with `id="title"`;

- [ ] there exist an horizontal and vertical axis, with `id="x-axis"` and `id="y-axis"` respectively;
- [ ] there exist a dot which visually displays each data point
- [ ] the dot(s) ought to have two attributes in `data-xvalue` and `data-yvalue`, each storing the corresponsing values on the axes
- [ ] the attributes ought to respect the range of the actual data and also the correct data format;
- [ ] the attributes and the dots they represent ought to match in value the corresponding points on the x and y axes
- [ ] tick labels on the x-axis ought to display the years
- [ ] tick labels on the y-ais ought to display the minute:seconds time formt (%M:%S)
- [ ] the labels of the axes are in the range of the actual data
- [ ] there exist a legend with `id="legend"`, describing the scatter plot
- [ ] there exist a tooltip with `id="tooltip"` to display additional information
- [ ] the tooltip should have a `data-year` attribute matching the `data-xvalue`.