$(document).ready(function () {
    window.click_once = false;
    const button = document.querySelector('button');

    $('#button').click(function (e) {
        e.preventDefault();
        $('#fname').html('GREB1');
    });

    $('#submit').click(function (e) {
        e.preventDefault();
        var start_time = Date.now();
        //e.stopPropagation();
        console.log(start_time, );

        document.getElementById("processtip").innerHTML = "<span class='ld ld-ring ld-spin'></span>"

        // ajax call
        var gene_name = $('#fname').val();

        // // get filter values
        // Celllines
        // for (i in window.focus_set['celline']) {
            
        // }
        var cellines = []
        for (i in window.focus_set['celline']) {
            var cell_i = $('#' + window.focus_set['celline'][i])
            cellines.push()
        }
        var cellline = $('#ss_elem_SKBR3').html(); 
        console.log("cellline" + cellline);
        $.getJSON("/tools/get_stats", {
            'gene_name': gene_name,
        }).done(function(processResult) {
            return stats_process_result(processResult);
        }).fail(
            function () {
                $('#processtip').html('<p>Server timeout, please <a id="refresher" onclick="location.reload()"><i>refresh</i><i class="fas fa-redo-alt ml-1"></i></a></p>');
                $('#aftersubmit').html('<p>Gene within the same clusters: <a href="/tools/">link text</a></p>')
                $('#myChart').html('<canvas id="myChart"></canvas>');
            }
        );
    });

    function stats_process_result (processResult) {
        console.log(processResult)
    }
});