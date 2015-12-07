var $gameBoxDiv = $('#mazeContainer')
var $startSafeZone = $('#startArea')
var $finishSafeZone = $('someHTMLEntityIDNotDecided#finishSafeZone')
var $messageDisplayBox = $('someHTMLEntityIDNotDecidedForMessage')
var attemptsCount
var $finishBox = $('someHTMLEntityNotDecided')
var levelNumber = 1
var congratulationsMessage = $('<p>Some html shit about congrats</p>')
var $startBox = $('#startArea')
var gameover = 2
var genericError = "error, error"


$(function () {
    /**
     * Game Logic!!
     */

    /**
     *startGame funcitonality
     */
    /**
     * ajax get request for next level and puts result into $gameBoxDiv
     *
     * @param levelNumber
     */
    function loadLevel(levelNumber) {
        $.get(('templates/level' + levelNumber + '.html'),
            function (data) {
                $gameBoxDiv.replaceWith(data)
                attemptsCount = 0
                resetClock();
            })
    }

    /**
     * TODO change this $startBox var to whatever the start element is
     * @type {*|jQuery|HTMLElement}
     */

    $startBox.click(function() {
        //Start Clock
        startClock();
        //increase attempt counter by 1
        $('#tally').text(++attemptsCount)
        //disable start zone
        $startSafeZone.off('click')
        //triggers death event
        $('.die').mouseover(function() {
            $gameBoxDiv.trigger('death')
        })
        //triggers complete event
        $finishSafeZone.mouseover(function() {
            $gameBoxDiv.trigger('completedLevel')
        })
    })

    /**
     * Success functionality
     */
    $finishBox.mouseover(function() {
        //todo remove post test
        alert("You have completed level 'levelNumber'")
        //change message box to display level congrats
        $messageDisplayBox.replaceWith("'congratulationsMessage'")
        //stops the clock
        stopClock();
        //disable death
        $('.die').off('mouseover')
        $.post('api/index.php', {
                'action': 'saveLevel',
                'level': levelNumber,
                'attempts': attemptsCount,
                'time': ticks
            }, // put data here from ajax into endOfGame
            function(data) {
                //success function
                levelNumber++
                if (levelNumber === gameover) {
                    $messageDisplayBox.replaceWith('#endOfGame').css({opacity: 0})
                    $messageDisplayBox.animate({
                        opacity: "100",
                        width: "600px",
                        height: "400px",
                        right: "0px",
                        top: "0px"
                    })
                }
                else {
                    loadLevel(levelNumber);
                }
            }
        ).fail(function() {
            $('#game').replaceWith(genericError);
        })
    })

    $('.die').mouseover(function() {
        $gameBoxDiv.trigger('death')
    })
    /*
     * When the user dies this function is called.
     * It does exactly what it says in the function, if you've got this far and cannot work out what this does then it's
     * even more of a waste of my time explaining it for you.
     * For now, proceed.
     */
    $gameBoxDiv.on('death', function () {
        stopClock()
        $startSafeZone.on('click')
        $messageDisplayBox.replaceWith("You have died! Please try again! Click the start area to start")
        $('.die').off('death')
    })
})
/**
 *startGame funcitonality
 */
/**
 * ajax get request for next level and puts result into $gameBoxDiv
 *
 * @param levelNumber
 */
function loadLevel(levelNumber) {
    $('#game').load('templates/level' + levelNumber + '.php',
        function() {
            attemptsCount = 0
            resetClock()
        })
}