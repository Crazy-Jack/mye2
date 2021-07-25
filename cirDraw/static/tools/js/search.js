// import calculateDatasetStats from '/static/tools/js/select.js';


$(document).ready(function () {
    window.click_once = false;
    

    $('.demo').tipso({
        // OPTIONS
        background  :'#333333',
        size: 'small',
        titleBackground   : '#f70c0c',
        titleContent: 'Hello',
        position: 'top-right',

        });

    
    // ===================== e2 related ================================
    const button = document.querySelector('button');
    
    $('#button').click(function (e) {
        e.preventDefault();
        $('#fname').html('GREB1');
    });

    function process_local_result (raw_data) {
        return raw_data;
    }

    var mydatasets = [];
    // ===================== Submit ===============
    $('#submit').click(function (e) {
        e.preventDefault();
        var start_time = Date.now();
        //e.stopPropagation();
        
        // console.log($('#fname').val());
        
        document.getElementById("processtip").innerHTML = "<span class='ld ld-ring ld-spin'></span>"
            
            
            
            var gene_name = $('#fname').val();
            if (window.click_once) {
                resetPage();
            }
            $.getJSON("/tools/search", {
                'gene_name': gene_name
            }).done(function(processResult){
                // console.log("I'm done loading data")
                console.log("Network response " + (Date.now() - start_time)/1000 + " s")
                document.getElementById("processtip").innerHTML = "";
                window.click_once = true;

                console.log(processResult);
                console.log("=============")
                processResult = process_local_result(processResult);
                // $('#myChart').html("<canvas id='myChart'></canvas>")
                console.log(processResult);
                // for microArray
                var stats1 = processResult[2];
                var stats2 = processResult[3];
                
                var canvas = document.getElementById("myChart");
                var ctx = canvas.getContext('2d');
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                // context.canvas.height = context.canvas.height;
                // Define the data 
                
                // Add data values to array
                
                var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#53FA04', '#00B3E6', 
                                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
                
                

                    data = processResult[0];
                    console.log("mydataset processing start time " + Date.now())
                    mydatasets = [];
                    var count = 0
                    var max_len = 0
                    for (var i in data) {
                        var item_radius = [];
                        var pointstyles = [];
                        var fills = [];
                        for (var k=0; k < data[i].length; k ++) {
                            item_radius.push(data[i][k].duration * 2);
                            // get dose
                            var dose_k = data[i][k].dose;
                            if (dose_k == 1) {
                                var pointstyle = 'circle';
                            } else if (dose_k == 10) {
                                var pointstyle = 'triangle';
                            } else if (dose_k == 1000) {
                                var pointstyle = 'rect';
                            }

                            pointstyles.push(pointstyle);

                            fills.push(data[i][k].multi_duration)
                        }
                        var item = {
                            radius: item_radius,
                            label: i,
                            data: data[i],
                            borderColor: colorArray[count],
                            backgroundColor: colorArray[count],
                            pointStyle: pointstyles,
                            fill: fills
                        }
                        mydatasets.push(item);
                        count += 1;
                        // max data len
                        if (data[i].length > max_len) {
                            max_len = data[i].length;
                        }
                    };

                    // sort
                    mydatasets.sort((a, b) => (a.data.length < b.data.length) ? 1 : -1);
                    window.mydatasets = mydatasets;

                    console.log("mydataset processing end time " + Date.now())
                    // // console.log(mydatasets.length)
                    document.getElementById("legend_container").innerHTML = "";
                    document.getElementById("duration_container").innerHTML = "";
                    document.getElementById("legend_stats").innerHTML = "";
                    document.getElementById("aftersubmit1").innerHTML = "";

                    document.getElementById("legend_container_rna").innerHTML = "";
                    document.getElementById("duration_container_rna").innerHTML = "";
                    document.getElementById("legend_stats_rna").innerHTML = "";
                    document.getElementById("aftersubmit2").innerHTML = "";

                    if (mydatasets.length == 0) {
                        // // console.log("len 0");
                    
                        document.getElementById("aftersubmit1").innerHTML = "Gene " + gene_name + " Not found in MicroArray database..."
                    }
                    else {

                        var colorList = mydatasets;
                        colorize = function(colorList, stats) {
                            var container = document.getElementById('legend_container');
                        
                            for (var item in colorList) {
                                // // console.log(item);
                                var boxContainer = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                // dataset len
                                
                                label.innerHTML = colorList[item]['label'] + "                                ";
                                box.className = "box";
                                box.style.backgroundColor = colorList[item]['backgroundColor'];
                                box.style.borderColor = colorList[item]['borderColor'];
                                box.style.textIndent = '20em';
                                

                                boxContainer.className = "box-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);
                                boxContainer.appendChild(label);

                                container.appendChild(boxContainer);

                            }

                            var container = document.getElementById('legend_stats');
                        
                            for (var item in colorList) {
                                // // console.log(item);
                                var boxContainer = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                // dataset len
                                var gene_name = colorList[item]['label']
                                var tooltip_stats = " up " + Math.round(stats[gene_name][1]*100) +"% ; down: " + Math.round(stats[gene_name][0]*100) + "% "
                                label.innerHTML =  "<span class='tooltips_my' title='hello' data-tipso='" + tooltip_stats + "'>" + colorList[item]['data'].length + "</span>";
                                
                                var explain_text = "Taken significant p-value as 0.05, percentage of up/down regulated experiments are shown for each cell line when hover on the left number"
                                if (item == 0) {
                                    label.innerHTML +="&nbsp;&nbsp;<span class='tooltips_info' title='hello' data-tipso='" + explain_text + "'><i class='fas fa-question-circle'></i></span>"
                                }
                                box.className = "box";
                                box.style.backgroundColor = colorList[item]['backgroundColor'];
                                box.style.borderColor = colorList[item]['borderColor'];
                                box.style.textIndent = '20em';
                                var width = Math.round(colorList[item]['data'].length / max_len * 120);
                                box.style.width = width+"px";
                                
                                boxContainer.className = "stats-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);
                                boxContainer.appendChild(label);

                                container.appendChild(boxContainer);

                            }


                        }

                        colorize(colorList, stats1);
                        
                        
                        // =========================================================
                        // duration container
                        // var colorList_dose = {'1h': "10px", '2h': "10px", '3h': "30%", '4h': "40%", 
                        //                     '6h': 0.5, '8h': 0.6, '12h': 0.7, '16h': 0.8, '18h': 0.9, '24h': 0.95, '48h': 1};
                        colorList_duration = [1, 2, 3, 4, 6, 8, 12, 16, 18, 24, 48];
                        colorList_dose = [1, 10, 1000];
                        colorize_duration = function(colorList, colorList_dose) {
                            var container = document.getElementById('duration_container');
                        
                            for (var item in colorList) {
                                // // console.log(item);
                                // // console.log(colorList[item]);
                                var boxContainer2 = document.createElement("DIV");
                                var boxContainer = document.createElement("DIV");
                                var boxContainer_t = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");

                                label.innerHTML = colorList[item] + " h  ";
                                box.className = "circle";
                                var size = Math.log10(colorList[item] + 1) * 10;
                                box.style.height = size + "px";
                                box.style.width = size + "px";
                                
                                box.style.textIndent = '20em';

                                boxContainer2.className = "box-contain";
                                boxContainer.className = "circle-contain";
                                boxContainer_t.className = "label-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);

                                boxContainer2.appendChild(boxContainer);
                                
                                boxContainer_t.appendChild(label)
                                boxContainer2.appendChild(boxContainer_t);
                                
                                container.appendChild(boxContainer2);

                            }

                            for (var item in colorList_dose) {
                                var boxContainer2 = document.createElement("DIV");
                                var boxContainer = document.createElement("DIV");
                                var boxContainer_t = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                if (colorList_dose[item] == 1) {
                                    var dose = '1 nM';
                                    var shape = 'circle';
                                } else if (colorList_dose[item] == 10) {
                                    var dose = '10 nM';
                                    var shape = 'triangle';
                                } else if (colorList_dose[item] == 1000) {
                                    var dose = '1000 nM';
                                    var shape = 'box';
                                }
                                label.innerHTML = dose;
                                box.className = shape;
                                if (shape == 'box' || shape == 'circle') {
                                    var size = Math.log10(24 + 1) * 14;
                                    box.style.height = size + "px";
                                    box.style.width = size + "px";
                                    box.style.textIndent = '20em';
                                    box.style.backgroundColor = "#FA1304";
                                    box.style.borderColor = "#FA1304";
                                }
                                
                                
                            
                                

                                boxContainer2.className = "box-contain";
                                boxContainer.className = "circle-contain";
                                boxContainer_t.className = "label-contain";
                                boxContainer2.style.width = "120px";
                                label.className = "label";
                                boxContainer.appendChild(box);

                                boxContainer2.appendChild(boxContainer);
                                
                                boxContainer_t.appendChild(label)
                                boxContainer2.appendChild(boxContainer_t);
                                
                                container.appendChild(boxContainer2);
                            }
                        }

                        colorize_duration(colorList_duration, colorList_dose);


                        // =========================================================
                        // Define Chart
                        
                        var myChart = new Chart(ctx, {
                            type: 'scatter',
                            data: {
                                datasets: mydatasets
                            },
                            options: {
                                // responsive: true,
                                // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                                legend: {
                                    display: false
                                 },
                                parsing: {
                                    xAxisKey: 'logfc',
                                    yAxisKey: 'logp',
                                },
                                'onClick' : function (evt, item) {
                                    // console.log ('legend onClick', evt);
                                    // console.log('legd item', item);
                                    var dataset_index = item['0']['datasetIndex']
                                    var innerIndex = item['0']['index'];
                                    // console.log(dataset_index)
                                    // console.log(innerIndex);
                                    var GSE = mydatasets[dataset_index]['data'][innerIndex]['GSE'];
                                    // console.log(GSE);
                                    var myurl = "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc="+GSE;
                                    // console.log(myurl);
                                    window.open(
                                        myurl, "_blank");
                                },
                                
                                
                            plugins: {
                                legend: {
                                    position: 'right',
                                    display: false
                                },
                                // title: {
                                //     display: true,
                                //     text: 'MicroArray Analysis ' ,
                                // },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var dur = Math.round(Math.exp(context.raw.duration) - 1);
                                            return context.raw.name + ': Duration: ' + dur + ' H ; logfc: ' + Number.parseFloat(context.raw.logfc).toPrecision(2) + '; '
                                                   + '-log adj p value: ' + Number.parseFloat(context.raw.logp).toPrecision(2)
                                        },
                                        
                                    }
                                }
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true,
                                            text: '- Log Adjusted p value'
                                        },
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return '' + value;
                                            }
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Log2 fold change (E2/Control)'
                                        },
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return '' + value;
                                            }
                                        }
                                    }
                                }
                            },
                        }); // ERAL1 DNM3
                        
                       
                       

                        document.getElementById("chart1-title-id").innerHTML = "<span><b>MicroArray Analysis</b></span></br><span>" + calculateDatasetStats(mydatasets, 0.5)+"</span>";
                        console.log("microarray processing end time " + Date.now())
                    }
                    // create filter table
                    // $("#filter-bar").removeClass("hidden");
                


                // ////////////////////////////////////////////
                // RNA seq
                var canvas = document.getElementById("myChart_rna");
                var ctx2 = canvas.getContext('2d');

                data = processResult[1];
                mydatasets_rna = [];
                var count = 0
                var max_len = 0
                for (var i in data) {
                    var item_radius = [];
                    var pointstyles = [];
                    for (var k=0; k < data[i].length; k ++) {
                        item_radius.push(data[i][k].duration * 2);
                        // get dose
                        var dose_k = data[i][k].dose;
                        if (dose_k == 1) {
                            var pointstyle = 'circle';
                        } else if (dose_k == 10) {
                            var pointstyle = 'triangle';
                        } else if (dose_k == 1000) {
                            var pointstyle = 'square';
                        }

                        pointstyles.push(pointstyle)
                        fills.push(data[i][k].multi_duration)
                    }
                    var item = {
                        radius: item_radius,
                        label: i,
                        data: data[i],
                        borderColor: colorArray[count],
                        backgroundColor: colorArray[count],
                        pointStyle: pointstyles,
                        showLine: fills
                    }
                    mydatasets_rna.push(item);
                    count += 1;
                    // max data len
                    if (data[i].length > max_len) {
                        max_len = data[i].length;
                    }
                };
                mydatasets_rna.sort((a, b) => (a.data.length < b.data.length) ? 1 : -1);
                window.mydatasets_rna = mydatasets_rna;
                    // console.log(mydatasets_rna.length)
                    if (mydatasets_rna.length == 0) {
                        // console.log("len 0");
                        
                            document.getElementById("aftersubmit2").innerHTML = "Gene " + gene_name + " Not found in RNA-seq database..."
                        
                    }
                    else {
                        
                        // console.log(mydatasets_rna);
                        // clear clf
                        $('#legend_container_rna').html("<div id='legend_container_rna'></div>");
                        $('#duration_container_rna').html("<div id='duration_container_rna'></div>");
                        // =========================================================
                        // create legends
                        // var colorList = [{'backgroundColor': '#FF6633', 'borderColor': '#FF6633', 'label': 'MCF7'},
                        //                 {'backgroundColor': '#FFB399', 'borderColor': '#FFB399', 'label': 'MM231'}]
                        // {t1: 'red', t2: 'green', t3: 'blue'};
                        var colorList = mydatasets_rna;
                        colorize = function(colorList, stats) {
                            var container = document.getElementById('legend_container_rna');
                        
                            for (var item in colorList) {
                                // console.log(item);
                                var boxContainer = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                // dataset len
                                
                                label.innerHTML = colorList[item]['label'] + "                                ";
                                box.className = "box";
                                box.style.backgroundColor = colorList[item]['backgroundColor'];
                                box.style.borderColor = colorList[item]['borderColor'];
                                box.style.textIndent = '20em';
                                

                                boxContainer.className = "box-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);
                                boxContainer.appendChild(label);

                                container.appendChild(boxContainer);

                            }

                            var container = document.getElementById('legend_stats_rna');
                        
                            for (var item in colorList) {
                                // console.log(item);
                                var boxContainer = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                // dataset len
                                var gene_name = colorList[item]['label']
                                var tooltip_stats = " up " + Math.round(stats[gene_name][1]*100)+"% ; down: " + Math.round(stats[gene_name][0]*100) + "% "
                                label.innerHTML =  "<span class='tooltips_my' title='hello' data-tipso='" + tooltip_stats + "'>" + colorList[item]['data'].length + "</span>";
                                
                                var explain_text = "Taken significant p-value as 0.05, percentage of up/down regulated experiments are shown for each cell line when hover on the left number"
                                if (item == 0) {
                                    label.innerHTML +="&nbsp;&nbsp;<span class='tooltips_info' title='hello' data-tipso='" + explain_text + "'><i class='fas fa-question-circle'></i></span>"
                                }

                                box.className = "box";
                                box.style.backgroundColor = colorList[item]['backgroundColor'];
                                box.style.borderColor = colorList[item]['borderColor'];
                                box.style.textIndent = '20em';
                                var width = Math.round(colorList[item]['data'].length / max_len * 120);
                                box.style.width = width+"px";

                                boxContainer.className = "stats-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);
                                boxContainer.appendChild(label);

                                container.appendChild(boxContainer);

                            }


                        }

                        colorize(colorList, stats2);
                        
                        
                        // =========================================================
                        // duration container
                        // var colorList_dose = {'1h': "10px", '2h': "10px", '3h': "30%", '4h': "40%", 
                        //                     '6h': 0.5, '8h': 0.6, '12h': 0.7, '16h': 0.8, '18h': 0.9, '24h': 0.95, '48h': 1};
                        colorList_duration = [1, 2, 3, 4, 6, 8, 12, 16, 18, 24, 48];
                        colorList_dose = [1, 10, 1000];
                        colorize_duration = function(colorList, colorList_dose) {
                            var container = document.getElementById('duration_container_rna');
                        
                            for (var item in colorList) {
                                // // console.log(item);
                                // // console.log(colorList[item]);
                                var boxContainer2 = document.createElement("DIV");
                                var boxContainer = document.createElement("DIV");
                                var boxContainer_t = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");

                                label.innerHTML = colorList[item] + " h  ";
                                box.className = "circle";
                                var size = Math.log10(colorList[item] + 1) * 10;
                                box.style.height = size + "px";
                                box.style.width = size + "px";
                                
                                box.style.textIndent = '20em';

                                boxContainer2.className = "box-contain";
                                boxContainer.className = "circle-contain";
                                boxContainer_t.className = "label-contain";
                                label.className = "label";
                                boxContainer.appendChild(box);

                                boxContainer2.appendChild(boxContainer);
                                
                                boxContainer_t.appendChild(label)
                                boxContainer2.appendChild(boxContainer_t);
                                
                                container.appendChild(boxContainer2);

                            }

                            for (var item in colorList_dose) {
                                var boxContainer2 = document.createElement("DIV");
                                var boxContainer = document.createElement("DIV");
                                var boxContainer_t = document.createElement("DIV");
                                var box = document.createElement("DIV");
                                var label = document.createElement("DIV");
                                
                                if (colorList_dose[item] == 1) {
                                    var dose = '1 nM';
                                    var shape = 'circle';
                                } else if (colorList_dose[item] == 10) {
                                    var dose = '10 nM';
                                    var shape = 'triangle';
                                } else if (colorList_dose[item] == 1000) {
                                    var dose = '1000 nM';
                                    var shape = 'box';
                                }
                                label.innerHTML = dose;
                                box.className = shape;
                                if (shape == 'box' || shape == 'circle') {
                                    var size = Math.log10(24 + 1) * 14;
                                    box.style.height = size + "px";
                                    box.style.width = size + "px";
                                    box.style.textIndent = '20em';
                                    box.style.backgroundColor = "#FA1304";
                                    box.style.borderColor = "#FA1304";
                                }
                                
                                
                            
                                

                                boxContainer2.className = "box-contain";
                                boxContainer.className = "circle-contain";
                                boxContainer_t.className = "label-contain";
                                boxContainer2.style.width = "120px";
                                label.className = "label";
                                boxContainer.appendChild(box);

                                boxContainer2.appendChild(boxContainer);
                                
                                boxContainer_t.appendChild(label)
                                boxContainer2.appendChild(boxContainer_t);
                                
                                container.appendChild(boxContainer2);
                            }
                        }

                        colorize_duration(colorList_duration, colorList_dose);


                        // =========================================================
                        // Define Chart
                        
                        var myChart = new Chart(ctx2, {
                            type: 'scatter',
                            data: {
                                datasets: mydatasets_rna
                            },
                            options: {
                                // responsive: true,
                                // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                                legend: {
                                    display: false
                                 },
                                parsing: {
                                    xAxisKey: 'logfc',
                                    yAxisKey: 'logp',
                                },
                                'onClick' : function (evt, item) {
                                    // console.log ('legend onClick', evt);
                                    // console.log('legd item', item);
                                    var dataset_index = item['0']['datasetIndex']
                                    var innerIndex = item['0']['index'];
                                    // console.log(dataset_index)
                                    // console.log(innerIndex);
                                    var GSE = mydatasets_rna[dataset_index]['data'][innerIndex]['GSE'];
                                    // console.log(GSE);
                                    var myurl = "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc="+GSE;
                                    // console.log(myurl);
                                    window.open(
                                        myurl, "_blank");
                                },
                                
                                
                            plugins: {
                                legend: {
                                    position: 'right',
                                    display: false
                                },
                                // title: {
                                //     display: true,
                                //     text: 'RNA-seq Analysis ' + mydatasets_rna.length
                                // },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var dur = Math.round(Math.exp(context.raw.duration) - 1);
                                            if (context.raw.multi_duration) {
                                                var dur = 'Multiple';
                                            }
                                            return context.raw.name + ': Duration: ' + dur + ' H ; logfc: ' + Number.parseFloat(context.raw.logfc).toPrecision(2) + '; '
                                                   + '-log adj p value: ' + Number.parseFloat(context.raw.logp).toPrecision(2)
                                        },
                                        
                                    }
                                }
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true,
                                            text: '- Log Adjusted p value'
                                        },
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return '' + value;
                                            }
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Log2 fold change (E2/Control)'
                                        },
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            callback: function(value, index, values) {
                                                return '' + value;
                                            }
                                        }
                                    }
                                }
                            },
                        }); // ERAL1 DNM3
                        
                        
                        
                    
                            // create filter table
                        InitFilter();
                        // $('#chart-title-id').html('<div id="chart-title-id" style="text-align: center;">hello</div>');
                        
                        document.getElementById("chart2-title-id").innerHTML = "<span><b>RNA-seq Analysis</b></span></br><span>" + calculateDatasetStats(mydatasets_rna, 2)+"</span>";
                        
                        $('.tooltips_my').tipso({
                            // OPTIONS
                        background  :'#333333',
                        size: 'small',
                        titleBackground   : '#0033cc',
                        titleContent: 'Significant (p < 0.05)',
                        position: 'top-right',

                            });  
                        $('.tooltips_info').tipso({
                            // OPTIONS
                            background  :'#0033cc',
                            size: 'small',
                            position: 'bottom-right',

                        });
                        // dash line
                        
                        $("#dashline2").html('<div id="dashline"><hr style="border: 1px dashed black;" /></div>')
                        
                        showPage();
                        var end_time = Date.now();
                        var delta_time = (end_time-start_time)/1000;
                        console.log('total time ' + delta_time + ' s')
                } 
                }).fail(
                function () {
                    $('#processtip').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');
                    $('#aftersubmit').html('<p>Gene within the same clusters: <a href="/tools/">link text</a></p>')
                    $('#myChart').html('<canvas id="myChart"></canvas>');
                }
            );

                
        

    })

    

    function InitFilter() {
        // console.log("OGH");
        // console.log(window.mydatasets); 

        // modify the content of gene name
        var input_html_genename = '';
        for (let i = 0; i < window.mydatasets.length; i++) {
            var name = window.mydatasets[i]['label'];
            input_html_genename += "<li id='" + name + "_id'" + " role='option'>" + name + "</li>"
          } 
        // input_html_genename += "<li id='all_id' role='option'>ALL</li>"
        // // console.log(input_html_genename);
        $("#ss_elem_list1").html(input_html_genename);

        $("#myfilterbox").removeClass("hidden");
        // console.log("OGH33333");

    } 

    function resetPage() {
        Chart.helpers.each(Chart.instances, function(instance){
            instance.destroy();
        });
        document.getElementById("myfilterbox").classList.add("hidden");
        document.getElementById("figure1").classList.add("hidden");
        document.getElementById("dashline2").classList.add("hidden");
        document.getElementById("figure2").classList.add("hidden");
    }    

    function showPage() {
        document.getElementById("myfilterbox").classList.remove("hidden");
        document.getElementById("figure1").classList.remove("hidden");
        document.getElementById("dashline2").classList.remove("hidden");
        document.getElementById("figure2").classList.remove("hidden");
    }

});