/*******************************************************************************
 * global variables and options
 *******************************************************************************
 */

//Defines String.format to behave similar to php's sprintf()
//Used for localization string substitution purposes
//Ex. String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET'); => ASP is dead, but ASP.NET is alive! ASP {2}
//This function may not be necessary. the translate function _ appears to already do this
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        return this.substr(position || 0, searchString.length) === searchString;
    };
}

//Converts from moment.js format to datepicker format
//keys need to be arranged in order of greatest number of characters to least ex. 'ddd' before 'dd'
var datepickerConvertionFormats = {
    Day: {Do: 'd', DD: 'dd', D: 'd', dddd: 'DD', ddd: 'D'},
    Month: {MMMM: 'MM', MMM: 'M', MM: 'mm', M: 'm'},
    Year: {YYYY: 'yy', YY: 'y'},
    Abbrev: {A: 'tt', a: 'tt'}
};

// global var for referencing contacts popout window
var contactsPopoutWindow;

// global var for tracking current state of the modal
var modalState = 'closed';
var modalTimer;

// ping webphone
if (typeof sub_user !== 'undefined') localStorage.setItem('webphone_present_' + sub_user, null);
localStorage.setItem('webphone_present', null); // webphone backwards compatibility
if (typeof sub_user !== 'undefined') localStorage.removeItem('webphone_present_' + sub_user);
localStorage.removeItem('webphone_present'); // webphone backwards compatibility

// global scrollTop cursor, used for smoothed modal behavior
var scrollTop;

if (typeof jsdebug === 'undefined') {
    jsdebug = getJsDebug();
}

if (typeof openModalId === 'undefined') {
    openModalId = null;
}

if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function () {
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (!String.prototype.isNumber) {
    String.prototype.isNumber = function () {
        return !isNaN(parseFloat(this)) && isFinite(this);
    };
}

//xhr requests object to keep track of existing requests
xhrRequests = {};

$.xhrPool = [];

$.xhrPool.abortAll = function () {
    var countAbort = 0;
    $(this).each(function (idx, jqXHR) {
        // log(idx);
        countAbort++;
        jqXHR.abort();

    });
    if (countAbort)
        log("Aborted " + countAbort + " ajax requests");
    $.xhrPool = [];
};

$.ajaxSetup({
    beforeSend: function (jqXHR) {
        $.xhrPool.push(jqXHR);
    },
    complete: function (jqXHR) {
        var index = $.inArray(jqXHR, $.xhrPool);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
        }
    }
});


/*******************************************************************************
 * document load
 *******************************************************************************
 */

// basic functions on document load
$(function () {
    $.ajaxSetup({cache: false});

    log('running basic scripts.js functions');
    initFlashMessage(6000, 800);
    radioSlide();
    greetingFade();
    msgFade();
    newDatePicker(0);
    dynamicDateField();
    attachValidation();
    initTooltips();
    initConfirmCall();
    initDownloadFile();
    showScheduledExports();
});

//condense navigation for smaller screens
//$(function() {
//  $('.condense').click(function(){
//      $('.nav-text').toggle();
//  })
//});

$(function () {
    log('adding xhr abort click events');
    $('body').on('click', '.nav-link', function () {
        if (typeof $.xhrPool != 'undefined') {
            try {
                $.xhrPool.abortAll();
            } catch (e) {

            }

        }
    });
    $('body').on('click', '.header-link', function () {
        if (typeof $.xhrPool != 'undefined') {
            try {
                $.xhrPool.abortAll();
            } catch (e) {

            }

        }
    });
});

//bind print-div buttons
$(function () {
    log('adding print button listeners');
    $('body').off('click.print').on('click.print', '.print-div', function () {
        var divId = $(this).data('target');

        printDiv(divId);
    });
});

//bind print-report buttons
$(function () {
    log('adding print report button listeners');
    $('body').off('click.print').on('click.print', '.print-report', function () {

        printReport();
    });
});

//initialize sticky table headers
$(function () {
    log('adding sticky table header');
    if ($('#domain-message').length)
        $('.fixed-table-header').stickyTableHeaders({fixedOffset: $('#domain-message')});
    else
        $('.fixed-table-header').stickyTableHeaders();
});

// modal event listeners
$(function () {
    log('adding modal event listeners');
    $('.modal')
        .off('show.modal').on('show.modal', function (e) {
        //make sure it's a modal show event
        if ($(e.target).hasClass("modal")) {
            log('modal "show" event triggered');
            var $modal = $(this);
            openModalId = $modal[0].id;

            modalResize($modal);

            //$('[class*="helpsy"]').tooltip('hide');
            $('.helpsy').tooltip('hide');
            scrollTop = $(window).scrollTop();
            bodyCss = {
                overflowY: ($('body').height() > $(window).height() ? 'scroll' : 'auto'),
                position: 'fixed',
                width: '100%',
                top: -1 * scrollTop
            };
            $('body').css(bodyCss); // hax to lock body scrolling when a modal is open
        }
    })
        .off('shown.modal').on('shown.modal', function (e) {
        //make sure it's a modal show event
        if ($(e.target).hasClass("modal")) {
            log('modal "shown" event triggered');
            var $modal = $(this);

            modalResize($modal);
        }
    })
        .off('hidden.modal').on('hidden.modal', function (e) {
        //make sure it's a modal show event
        if ($(e.target).hasClass("modal")) {
            log('modal "hidden" event triggered');

            openModalId = '';

            log(openModalId);

            $('body').css({
                overflowY: 'auto',
                position: 'static',
                width: 'auto'
            });
            $(window).scrollTop(scrollTop);
        }
    });

    //listen for resize event on modal.
    //manual trigger: use $(this).parents('.modal').trigger('resize') when working within a modal
    $('.modal').off('resize.modal').on('resize.modal', function (e) {
        //log('modal "resize" event triggered');
        var $modal = $(this);

        modalResize($modal);
    });

    $(window).resize(function () {

        if (openModalId) {
            log(openModalId);
            modalResize($('#' + openModalId));
        }

    });

});

//show and hide application autocomplete fields in DID application select
$(function () {
    log('adding DID application select events');
    $('#PhonenumberApplication').change(function () {
        var val = $(this).val();
        //log(val);
        //log("xxxxx"+typeof $('#PhonenumberTimeframes'));

        var isTimeFrame = false;
        if ($('#PhonenumberTimeframes').prop('checked'))
            isTimeFrame = true;

        if ($('div[id^="find-"]').is(':visible')) {

            if (isTimeFrame)
                $('div[id^="find-"]:visible').hide();
            else
                $('div[id^="find-"]:visible').animate({
                    opacity: "hide"
                }, function () {
                    //log('showing' +val);

                    if (!isTimeFrame) {
                        //log("checked false");
                        $('#find-' + val).animate({
                            opacity: "show",
                        }, {
                            progress: function () {
                                modalResize($(this).parents('.modal'));
                            }
                        });
                    }
                });

        } else {
            //log("ELSE path");
            if (!isTimeFrame) {
                $('#find-' + val).animate({
                    height: "show",
                    opacity: "show"
                }, {
                    progress: function () {
                        modalResize($(this).parents('.modal'));
                    }
                });
            }

        }

        if (isTimeFrame) {
            $('.treatmentBox').hide();
            $('.tzCapable').animate({
                height: "show", opacity: "show"
            }, {
                progress: function () {
                    modalResize($(this).parents('.modal'));
                }
            });
            //console.log("timeframes is on");

        } else {
            $('#app-details .tzCapable').hide();
            $('.tzCapable.accordion-group').animate({
                height: "hide", opacity: "hide"
            }, {
                progress: function () {
                    modalResize($(this).parents('.modal'));
                }
            });
            $('.treatmentBox').fadeIn();
            //console.log("timeframes is off");
        }

        if ($(this).val() == 'trunk') {
            //log("is trunk");
            //log($('#trunk-choices-dd').data('domain'));
            //log($('#domain-choices').val());
            //log($('#trunk-choices-dd option').length);

            $('#trunk-choices').hide();
            $('#trunk-choices-dd').hide();

            if (($('#trunk-choices-dd option').length > 0) && ($('#trunk-choices-dd').data('domain') == $('#domain-choices').val())) {

                $('#trunk-choices').show();
                $('#trunk-choices-dd').show();
            } else {
                log("looking up trunk");
                $('#trunk-choices').show();
                $('#trunk-choices').prop("disabled", true);
                $('#trunk-choices').val( 'Finding SIP Trunks....');
                $.getJSON('/portal/siptrunks/listTrunks/' + $('#domain-choices').val(), function (data) {
                    $('#trunk-choices').hide();
                    $('#trunk-choices-dd').empty();
                    $('#trunk-choices-dd').show();
                    //log(data);

                    $('#trunk-choices-dd').append("<option value=\"\">Please select SIP Trunk</option>");

                    $.each(data.trunks, function (key, val) {
                        var selected = "";
                        $('#trunk-choices-dd').append("<option value='" + val + "' " + selected + ">" + val + "</option>");
                    });


                });
            }


        } else if ($(this).val() == 'route') {
            //log("is route");
            //log($('#route-choices-dd').data('domain'));
            //log($('#domain-choices').val());

            $('#route-choices').hide();
            $('#route-choices-dd').hide();

            if (($('#trunk-choices-dd').children('option').length > 0) && ($('#trunk-choices-dd').data('domain') == $('#domain-choices').val())) {
                $('#route-choices').hide();
                $('#route-choices-dd').show();
            } else {
                log("looking up routes");
                $('#route-choices').show();
                $('#route-choices').prop("disabled", true);
                $('#route-choices').val( 'Finding Route Profiles....');
                $.getJSON('/portal/routeprofiles/listTrunks/' + $('#domain-choices').val() + "", function (data) {
                    $('#route-choices').hide();
                    $('#route-choices-dd').empty();
                    $('#route-choices-dd').show();
                    //log(data);

                    $('#route-choices-dd').append("<option value=\"\">Please select Route Profile</option>");

                    $.each(data.trunks, function (key, val) {
                        var selected = "";
                        $('#route-choices-dd').append("<option value='" + val + "' " + selected + ">" + val + "</option>");
                    });


                });
            }


        } else if ($(this).val() == 'user') {

            log($('#user-choices'));
            log($('#user-choices').length);


        }

        //if ($(this).val() =='user')
        //  $('.tzCapable').show();
        //else
        //$('.tzCapable').hide();


    });
});

//custom file input display field
$(function () {
    log('adding file location field listener');
    $('input:file').change(function () {
        var fileLocation = $(this).val();
        $('.file-location').val(fileLocation).blur();
    });
});

//timepicker
//$(function() {
//  var i=0;
//  for (i=0;i<=6;i++) {
//    var timeFrom = $('input#from-timepicker-' + i);
//    var timeTo = $('input#to-timepicker-' + i);
//    if (typeof timeFrom=="undefined")
//        continue;
//    if(typeof timeFrom.timepicker != 'function') {
//        continue;
//    }
//    timeFrom.timepicker({
//      ampm: true,
//      timeFormat: "h:mm tt",
//      hourGrid: 4,
//      minuteGrid: 10,
//      hour: 0,
//      minute: 0
//    });
//    timeTo.timepicker({
//      ampm: true,
//      timeFormat: "h:mm tt",
//      hourGrid: 4,
//      minuteGrid: 10,
//      hour: 23,
//      minute: 59
//    });
//  }
//});

//confirmation plugin calls (uses bootstrap popover)
$(function () {
    log('adding confirmation popovers');
    //confirmation popup with default options, best for hyperlink confirmation
    //add specific options via the data attribute
    //onConfirm cannote be set via the data attributes
    $('[data-toggle="confirmation"]').confirmation({
        placement: 'left',
        btnOkClass: 'btn-danger',
        btnOkLabel: '<i class="icon-ok-sign icon-white"></i> ' + _('Yes', true),
        btnCancelLabel: '<i class="icon-remove-sign"></i> ' + _('No', true),
        singleton: true,
        popout: true,
        container: 'body'
    });

    $('[data-toggle="confirmation-agent-migration"]').confirmation({
        placement: 'top',
        btnOkClass: 'btn-primary',
        btnOkLabel: '<i class="icon-ok-sign icon-white"></i> ' + _('Convert', true),
        btnCancelLabel: '<i class="icon-remove-sign"></i> ' + _('Cancel', true),
        singleton: true,
        popout: true,
        container: 'body',
        onConfirm: function (e) {
          $('.popover').hide();
          $('[data-toggle="confirmation-agent-migration"]').html(_('Converting...',true));
          $('[data-toggle="confirmation-agent-migration"]').prop("disabled",true);
          agent_migrate();
        },
        onCancel: function (e) {
          $('#migrate-agents-btn').click();
        }

    });

    //special case delete confirmation for aa greetings because of onConfirm
    //onConfirm grabs needed data from the originating button
    $('[data-toggle="aa-greeting-confirmation"]').confirmation({
        placement: 'left',
        href: 'javascript:void(0);',
        btnOkClass: 'btn-danger aa-greeting-confirm',
        btnOkLabel: '<i class="icon-ok-sign icon-white"></i> ' + _('Yes', true),
        btnCancelLabel: '<i class="icon-remove-sign"></i> ' + _('No', true),
        singleton: true,
        popout: true,
        container: 'body',
        onConfirm: function (e) {
            var currentTarget = e.currentTarget;
            var element = '#' + $(currentTarget).attr('data-orig-btn');
            var row_id = $(element).attr('data-row-id');
            var callee_match = $(element).attr('data-callee-match');
            var starting = $(element).attr('data-starting');
            var greeting_index = $(element).attr('data-greeting-index');
            var timeframe = $(element).attr('data-timeframe');

            // make sure the greeting confirmation bubble goes away
            $('[data-toggle="aa-greeting-confirmation"]').confirmation('destroy');

            jsFlash(_('Deleting...'));

            $('#' + row_id).css('opacity', 0.5);
            $('#' + row_id + ' delete, #' + row_id + ' edit').hide();
            var jqxhr = $.post('./introdelete/' + callee_match + '/' + starting + '/' + greeting_index + '/' + timeframe, function (data) {

                log(data);
                if (data.indexOf("REDIRECT") > -1) {
                    var arr = data.split(":");
                    log(arr);
                    window.location.replace("/portal/attendants/edit/" + arr[1] + "/" + arr[2] + "/");
                    return;
                }

            })
                .done(function () {
                    loadIntroModal();
                    log("in done");
                    jsFlash(_('Greeting has been deleted.'), 'success');
                })
                .fail(function () {
                    $('#' + row_id).css('opacity', 1);
                    $('#' + row_id + ' delete, #' + row_id + ' edit').show();
                    log("in error");
                    jsFlash(_('Greeting was not deleted!'), 'danger');
                });
        }
    });

    //special case delete confirmation for aa greetings because of onConfirm
    //onConfirm grabs needed data from the originating button
    $('[data-toggle="user-greeting-confirmation"]').confirmation({
        placement: 'left',
        href: 'javascript:void(0);',
        btnOkClass: 'btn-danger user-greeting-confirm',
        btnOkLabel: '<i class="icon-ok-sign icon-white"></i> ' + _('Yes', true),
        btnCancelLabel: '<i class="icon-remove-sign"></i> ' + _('No', true),
        singleton: true,
        popout: true,
        container: 'body',
        onConfirm: function (e) {
            var currentTarget = e.currentTarget;
            var element = '#' + $(currentTarget).data('orig-btn');
            var row_id = $(element).data('row-id');
            var uid = $(element).data('uid');
            var greeting_index = $(element).data('greeting-index');

            $('#' + row_id).css('opacity', 0.5);
            $('#' + row_id + ' delete, #' + row_id + ' edit').hide();
            var jqxhr = $.post('./greetings/delete/' + uid + '/' + greeting_index, function (data) {


            })
                .done(function () {
                    $('#' + row_id).remove();
                    jsFlash('Greeting has been deleted.', 'success');
                })
                .fail(function () {
                    $('#' + row_id).css('opacity', 1);
                    $('#' + row_id + ' delete, #' + row_id + ' edit').show();
                    jsFlash(_('Greeting was not deleted') + "!", 'danger');
                });
        }
    });

    let recentClick = false;
    $('[data-toggle="confirmation-blocked-numbers"]').confirmation({
        placement: 'left',
        btnOkClass: 'btn-danger',
        btnOkLabel: '<i class="icon-ok-sign icon-white"></i> ' + _('Yes', true),
        btnCancelLabel: '<i class="icon-remove-sign"></i> ' + _('No', true),
        singleton: true,
        popout: true,
        container: 'body',
        onConfirm: function () {
            bulkRemoveNumbers();
        },
        onCancel: function (e) {
            if ($('#delete-all-btn').is(':visible'))
            {
                $('#delete-all-btn').click();
            }
            else if ($('#delete-selected-btn').is(':visible'))
            {
                if (!recentClick)
                {
                    recentClick=true;
                    console.log("onCancel");
                    $('#delete-selected-btn').click(); 
                    setTimeout(function() {
                        recentClick=false;
                    },1000);
                }
            }
            else
                $('.popover').hide();
        }
        
    });
});

//informational popovers (uses bootstrap popover)
$(function () {
    log('adding popovers');
    if (typeof $('a.view-timeframe').popover == 'function')
        $('a.view-timeframe').popover({
            trigger: 'hover',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            delay: {show: 200, hide: 0}
        });
    if (typeof $('a.view-qos').popover == 'function')
        $('a.view-qos').popover({
            trigger: 'hover',
            template: '<div class="popover qos-popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            delay: {show: 200, hide: 0}
        });

    if (typeof $('a.view-preview').popover == 'function')
        $('a.view-preview').popover({
            trigger: 'hover',
            template: '<div class="popover faxpreview-popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            delay: {show: 200, hide: 0}
        });
    if (typeof $('.label-popover').popover == 'function')
        $('.label-popover').popover({
            trigger: 'hover',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            container: 'body',
            html: true,
            delay: {show: 200, hide: 0}
        });
    if (typeof $('.label-popover-scopes').popover == 'function')
        $('.label-popover-scopes').popover({
            trigger: 'hover',
            template: '<div class=\"popover uiconfig\"><div class=\"arrow\"></div><div class=\"popover-inner uiconfig\"><h3 class=\"popover-title uiconfig\"></h3><div class=\"popover-content uiconfig\"><p></p></div></div></div>',
            container: 'body',
            html: true,
            delay: {show: 200, hide: 100}
        });

    if (typeof $('.clickable-popover').popover == 'function')
        $('.clickable-popover').popover({
            trigger: 'click',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            container: 'body',
            html: true,
        });
});

//table sorting on answering rules
$(function () {
    log('adding table sorting for answering rules');
    //fixHelper keeps the dragged element from collapsing when dragging
    var fixHelper = function (e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    };

    $('#sort-rules tbody').sortable({
        items: 'tr',
        helper: fixHelper,
        tolerance: 'pointer',
        placeholder: 'sort-placeholder',
        'start': function (event, ui) {
            ui.placeholder.html('<td colspan="5" class="sort-placeholder-td">&nbsp;</td>');
            ui.placeholder.height(ui.helper.height());
        },
        update: function (event, ui) {
            var ordering = $('#sort-rules tbody').sortable('toArray').join('/');
            var action = 'reorder';
            if ($('#' + action).length) {
                var href = $('#' + action).attr('href');
                var base = href.substring(0, href.indexOf('/', href.indexOf(action) + action.length + 1));
                $('#' + action).attr('href', base + '/' + ordering);
                $('#save-priority').animate({height: "show", opacity: "show"}, 150);
            } else if ($('#orderfinish').length) {
                var elements = [];
                $('#sort-rules tr:visible').each(function () {
                    elements.push($(this).data('priority'));
                });
                $('#orderfinish').val(elements.toString().replace(/^,|,$/g, ''));
            }

        },
        axis: 'y',
        cursor: 'move',
        distance: 10,
        opacity: 0.8
    });
    $('#sort-rules tbody').disableSelection();

    $('#sort-music tbody').sortable({
        items: 'tr',
        helper: fixHelper,
        tolerance: 'pointer',
        placeholder: 'sort-placeholder',
        'start': function (event, ui) {
            ui.placeholder.html('<td colspan="6" class="sort-placeholder-td">&nbsp;</td>');
            ui.placeholder.height(ui.helper.height());
        },
        update: function (event, ui) {
            var ordering = $('#sort-music tbody').sortable('toArray').join(',');
            $('#orderMus').val(ordering);
            $('#save-priority').animate({
                height: "show", opacity: "show"
            }, 150);
            updateRowNumbers();

        },
        axis: 'y',
        cursor: 'move',
        distance: 10,
        opacity: 0.8
    });
    $('#sort-music tbody').disableSelection();


    $('#sort-message tbody').sortable({
        items: 'tr:not(:first)',
        helper: fixHelper,
        tolerance: 'pointer',
        placeholder: 'sort-placeholder',
        'start': function (event, ui) {
            ui.placeholder.html('<td colspan="6" class="sort-placeholder-td">&nbsp;</td>');
            ui.placeholder.height(ui.helper.height());
        },
        update: function (event, ui) {
            var ordering = $('#sort-message tbody').sortable('toArray').join(',');
            $('#orderMsg').val(ordering);
            $('#save-priority').animate({
                height: "show", opacity: "show"
            }, 150);
            updateRowNumbers();
        },
        axis: 'y',
        cursor: 'move',
        distance: 10,
        opacity: 0.8
    });
    $('#sort-message tbody').disableSelection();
});


// update the index of the rows on the music/messages tables, always keep the order, just update it so the user doesnt get confused
function updateRowNumbers() {
    $('#sort-music > tbody  > tr > td.order').each(function(index, td) {
        td.innerText = index+1;
    });
    $('#sort-message > tbody  > tr > td.order').each(function(index, td) {
        td.innerText = index+1;
    });
}

//checks placeholder compatibility with non-modern browsers
//this checks to see if the browser supports placeholders
$(function () {
    log('checking placeholder support');
    $.support.placeholder = false;
    test = document.createElement('input');
    if ('placeholder' in test) $.support.placeholder = true;
});

//if the browser does not support placeholders, run this javascript alternative
$(function () {
    if (!$.support.placeholder) {
        log('placeholders not supported, using javascript alternative');
        var active = document.activeElement;
        $(':text').focus(function () {
            if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
                $(this).val('').removeClass('hasPlaceholder');
            }
        }).blur(function () {
            if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
                $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
            }
        });
        $(':text').blur();
        $(active).focus();
        $('form').submit(function () {
            $(this).find('.hasPlaceholder').each(function () {
                if ($(this).val() == $(this).attr('placeholder')) {
                    $(this).val('');
                }
            });
        });
    }
});

$(function () {
    setTimeout(function () {
        //User Modal autocompletes
        $('input#site').attr('autocomplete', 'disable_please');
        $('input#department').attr('autocomplete', 'disable_please');
        $('input#UserFirstName').attr('autocomplete', 'disable_please');
        $('input#UserLastName').attr('autocomplete', 'disable_please');
        $('input#UserCallidNmbr').attr('autocomplete', 'disable_please');
        $('input#UserCallidEmgr').attr('autocomplete', 'disable_please');
        $('input#UserAreaCode').attr('autocomplete', 'disable_please');

        //Domain modal autocompletes
        $('input#DomainDomain').attr('autocomplete', 'disable_please');
        $('input#DomainEmailSender').attr('autocomplete', 'disable_please');
        $('input#DomainAreaCode').attr('autocomplete', 'disable_please');

        $('input#CdrscheduleScheduleName').attr('autocomplete', 'disable_please');



    }, 200);
});

$(function () {
    log('scripts.js: end document load functions');
});

/*******************************************************************************
 * Custom functions
 *******************************************************************************
 */

//jquery method: takes string and inserts into cursor position
jQuery.fn.extend({
    insertAtCaret: function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.toString().length;
                this.selectionEnd = startPos + myValue.toString().length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});

function placeholderInit(input) {
    if (!$.support.placeholder) {
        $(input).focus(function () {
            if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
                $(this).val('').removeClass('hasPlaceholder');
            }
        }).blur(function () {
            if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
                $(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
            }
        });
        $(input).blur();
    }
}

function getJsDebug() {
    var storage = $.localStorage;
    var setting = false;

    if (storage.isSet('jsDebugSetting'))
        setting = storage.get('jsDebugSetting');
    if (storage.isSet('jsTraceSetting'))
        jstrace = storage.get('jsTraceSetting');
    else
        jstrace = false;

    return setting;
}

function buildAndSetAutoComplete(type, source, input, exclusions, value, fuzzymatch) {
    if (typeof fuzzymatch == 'undefined')
      fuzzymatch = false;
    var typeChoices = [];

    typeChoices[source] = $("#" + source + " option").map(function () {
        if (typeof exclusions === 'undefined' || exclusions == null)
            return this.value;
        else if (!exclusions.includes(this.value))
            return this.value;
    });

    let minLength = 0;
    if (value && value != null && value !="")
    {
      var autocompleteChoices = $("#" + source + " option").filter(function () {
        if (fuzzymatch && this.dataset  && this.dataset.cleaned && this.dataset.cleaned.startsWith(value))
          return true;
        if (this.dataset && value == this.dataset.cleaned)
          return true;
        return false;
      });
      if (typeof autocompleteChoices != 'undefined' && autocompleteChoices.length== 1 && autocompleteChoices[0].value)
        input.val(autocompleteChoices[0].value);
    }

    if (typeChoices[source].length > 3000)
      minLength =3;
    input.autocomplete({
        //autoFocus: true,
        minLength: minLength,
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(typeChoices[source], request.term);
            if (!results.length) {
                input.validationEngine("showPrompt",
                    "* " + _("No Matches Found") + "!", "red", "bottomLeft", true);
            } else {
                input.validationEngine("hidePrompt");
            }

            response(results);
        },

        select: function (event, ui) {
            var selectedObj = ui.item;

            var event = new CustomEvent('autocomplete-select', {
                detail: {
                    event: event,
                    selectedObj: selectedObj
                }
            });
            window.dispatchEvent(event);
        }
    });

}

addAnswerruleAutocomplete = (buttonConfig) => {
  if (buttonConfig.extra.targetUser.includes(" "))
    buttonConfig.extra.targetUser = buttonConfig.extra.targetUser.substring(0, buttonConfig.extra.targetUser.indexOf(' '));

  if(!$("option[data-extension='" + buttonConfig.extra.targetUser +"']").length)
  {
    console.log("no user match for now.");
    return;
  }
  let inputId = "target_"+buttonConfig.index;
  const newid = 'available_answerrules_'+buttonConfig.extra.targetUser;

  if ($('#'+newid).length)
  {
    if (buttonConfig.target)
      buildAndSetAutoComplete('answerrule',newid,$("#"+inputId),null, buttonConfig.target);
    else {
      buildAndSetAutoComplete('answerrule',newid,$("#"+inputId));
    }
    return;
  }

  netsapiens.api.post(
    {
        object:"answerrule",
        action:"read",
        user: buttonConfig.extra.targetUser ,
        domain:sub_domain
    }
  )
  .catch(function (e) {
    console.log(e)
  })
  .then(function (data) {
    clearAutoComplete(inputId);
    if (!$('#'+newid).length)
    {
      var sel = $('<select id="'+newid+'">').appendTo('body');
      Object.values(data).forEach(val => {
        if (val.time_frame == "*")
          sel.append($("<option>").attr('value',_("Default")).text("*"));
        else
          sel.append($("<option>").attr('value',val.time_frame).text(val.time_frame));
      });
    }

    if (buttonConfig.target)
      buildAndSetAutoComplete('answerrule',newid,$("#"+inputId),null, buttonConfig.target);
    else {
      buildAndSetAutoComplete('answerrule',newid,$("#"+inputId),null,"");
    }


  });

}

/*
 * Turns log() debug on and off.
 *
 * @param {boolean} setting turns on or off the log
 * @param {boolean} trace turn on or off trace data in the log
 *
 */
function setJsDebug(setting, trace) {
    var storage = $.localStorage;

    storage.set('jsDebugSetting', setting);

    jsdebug = setting;

    if (typeof trace !== 'undefined') {
        storage.set('jsTraceSetting', trace);
        jstrace = trace;
    }
}

function log(msg, force) {
    if (jsdebug && typeof console != 'undefined' && typeof console.log == 'function' && typeof msg != 'undefined')
        console.log(msg);
    else if (typeof force !== 'undefined' && force === true && typeof msg != 'undefined')
        console.log(msg);

    if (jstrace)
        console.trace();
}

function getFieldWidthClass(element, maxSmall, maxMed) {
    var format = '';
    if (element.hasAttribute('data-date-format'))
        format += element.getAttribute('data-date-format') + " ";

    if (element.hasAttribute('data-time-format'))
        format += element.getAttribute('data-time-format');

    if (format) {
        var formatWidths = {
            Year: {YYYY: 30, YY: 15},
            Day: {Do: 25, DD: 15, D: 7, dddd: 65, ddd: 25},
            Month: {MMMM: 65, MMM: 25, MM: 15, M: 7},
            Hour: {HH: 15, H: 7, hh: 15, h: 7},
            Minute: {mm: 15},
            Second: {ss: 15},
            Abbrev: {A: 20, a: 20}
        };

        var width = 0;
        for (var category in formatWidths) {
            $.each(formatWidths[category], function (formatType, formatWidth) {
                if (format.indexOf(formatType) != -1) {
                    width += formatWidth;
                    return false;
                }
            });
        }

        if (width <= maxSmall)
            return 'date-small';
        else if (width > maxSmall && width <= maxMed)
            return 'date-medium';
        else if (width > maxMed)
            return 'date-large';
    }
    return null;
}

function reloginWebphone(nmbr) {
    $.get('/portal/webphone/relogin', function (data) {
        setTimeout(function () {
            launchWebPhone(nmbr);
        }, 400);
    });
}

function getContactList(type = "all") {
  var contactlist = [ ];

  $("#contacts-table tr.contact-row-info").each(function () {

      //log($(this));
      var c = {name:$(this).find(".contact-name").text()};

      if(enableChatUC && (type == "all" || type == "chat" || type == "chat-name-change" || type == "chat-video-invite" || type == "chat-participant-add" || type == "chat-participant-remove" || type == "chat-participant-leave")) {
          c.extension = $(this).find(".contact-extension").text();
          if (typeof c.extension!='undefined' && c.extension !="" && c.extension!= c.name)
          {

              c.label = c.name + " - Chat";
              c.imgclass =  "icon-comment";
              c.value = $(this).find(".contact-extension").html();
              c.text = c.label;
              c.id = c.value;
              c.text += '(num)'+c.value; //add the value/number to the id as well

              contactlist.push(c);

          }
          else
              delete c.extension ;
      }


      if(enableChatSMS  && (type == "all" || type == "sms" || type == "mms")) {
          $(this).find(".dropdown-menu li").each(function () {
              if($(this).data("smsnumber")) {
                  var tmpType =  $.extend(true, {}, c);
                  tmpType.value = $(this).data("smsnumber");
                  tmpType.number = $(this).data("smsnumber");
                  if ($(this).hasClass("smsmobile"))
                  {
                      tmpType.label = c.name + " - Mobile SMS";
                      tmpType.imgclass =  "nsicon nsicon-mobile";
                      tmpType.pretty = netsapiens.utils.formatPhoneNumber(tmpType.number.toString(), PORTAL_LOCALIZATION_NUMBER_FORMAT);
                  }
                  else if ($(this).hasClass("smshome"))
                  {
                      tmpType.label = c.name + " - Home SMS";
                      tmpType.imgclass =  "nsicon nsicon-home";
                      tmpType.pretty = netsapiens.utils.formatPhoneNumber(tmpType.number.toString(), PORTAL_LOCALIZATION_NUMBER_FORMAT);
                  }
                  else if ($(this).hasClass("smswork"))
                  {
                      tmpType.label = c.name + " - Work SMS";
                      tmpType.imgclass =  "nsicon nsicon-work";
                      tmpType.pretty = netsapiens.utils.formatPhoneNumber(tmpType.number.toString(), PORTAL_LOCALIZATION_NUMBER_FORMAT);
                  }
                  tmpType.text = tmpType.label+'(num)'+tmpType.value;;

                  tmpType.id = tmpType.label;

                  contactlist.push(tmpType);
              }

          });
      }

  });

  return contactlist;
}

function filterContactList(allContacts, toFilterUid, toFilterName) {
    if (typeof toFilterUid == 'undefined' || typeof toFilterName == 'undefined') {
        return allContacts;
    }
    var filteredContacts = [];
    for (var index = 0; index < allContacts.length; index++) {
        if ((allContacts[index].extension && toFilterUid.includes(allContacts[index].extension))
            || (allContacts[index].name && toFilterName.includes(allContacts[index].name))) {
        } else {
            filteredContacts.push(allContacts[index]);
        }
    }

    return filteredContacts;
}


/*
 * Re-focus webphone tab/window
 *
 * @param {string} number passed from portal
 *
 *
 */
var webphoneTab, webphoneWindow;

function launchWebPhone(nmbr) {
    // check local storage for webphpone + user
    var webphoneOpen = localStorage.getItem('webphone_open_' + sub_user);

    if (!webphoneOpen || webphoneOpen == 'false') {
        var query = '?user=' + sub_user;
        if (nmbr) {
            query += '&call=' + nmbr;
        }
        if (PORTAL_WEBPHONE_NEW_TAB_VIEW) {
            // UI Config for new tab view ( set to yes )
            webphoneTab = window.open('/webphone' + query, 'webphone');
            webphoneTab.focus();
        } else {
            // Webphone Window view ( compact webphone )
            webphoneWindow = window.open('/webphone' + query, 'webphone',
                'directories=no,titlebar=no,location=no,status=no,menubar=no,resizable=no,width=400,height=640');
        }
    } else if (nmbr) {
        // Portal call passing number to Webphone
        localStorage.setItem('webphone_call_' + sub_user, nmbr);
        localStorage.removeItem('webphone_call_' + sub_user);
        localStorage.setItem('webphone_call', nmbr);
        localStorage.removeItem('webphone_call');
        if (!webphoneWindow && !webphoneTab) {
          if (PORTAL_WEBPHONE_NEW_TAB_VIEW) {
              webphoneTab = window.open('', 'webphone');
              if (webphoneTab)
                webphoneTab.focus();
          } else {
              // Webphone Window view ( compact webphone )
              webphoneWindow = window.open('', 'webphone');
              if (webphoneWindow)
                webphoneWindow.focus();
          }
            //localStorage.removeItem('webphone_open_' + sub_user);
            //launchWebPhone();
        } else if (webphoneWindow && !webphoneTab) {      // Webphone window is open
            webphoneWindow.focus();
        } else if (!webphoneWindow && webphoneTab) {      // Webphone tab is open
            webphoneTab.focus();
        }
    } else {
        if (!webphoneWindow && !webphoneTab) {            // NO instance of tab/window found
            localStorage.removeItem('webphone_open_' + sub_user);
            launchWebPhone();
        } else if (webphoneWindow && !webphoneTab) {      // Webphone window is open
            webphoneWindow.focus();
        } else if (!webphoneWindow && webphoneTab) {      // Webphone tab is open
            webphoneTab.focus();
        }

    }

}

function launchPremiumVideo(sub_domain, sub_user) {
    netsapiens.api.v2({ object: 'video', action: 'get' }, `domains/${sub_domain}/users/${sub_user}/video`)
        .then((host) => {
            var url = `https://${host.iotum_domain}/auth?host_id=${host.host_id}&login_token_public_key=${host.login_token_public_key}&redirect_url=conf/conferences/create?events=false`;
            // var options = 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,resizable=no,width=1200,height=900';
            var openWin = window.open(url,'_video');
        }).catch((e) => {
            console.error('launchPremiumVideo error:',e);
        });
}
// open contacts popout or focus it if already open
// unique window name means we'll always use the same window
function openContactsPopoutWindow() {
    var url = '/portal/contacts/popout';
    var params = 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,resizable=no,width=275,height=600';
    if (typeof (contactsPopoutWindow) == 'undefined' || contactsPopoutWindow.closed) {
        //create new, since none is open
        contactsPopoutWindow = window.open(url, "contacts_popout_window", params);
    } else {
        try {
            contactsPopoutWindow.document; //if this throws an exception then we have no access to the child window - probably domain change so we open a new window
        } catch (e) {
            contactsPopoutWindow = window.open(url, "contacts_popout_window");
        }

        //focus the window if it already exists
        contactsPopoutWindow.focus();
    }
}

function convertByMapping(original, conversionUnits) {
    for (var key in conversionUnits) {
        $.each(conversionUnits[key], function (baseUnit, conversionUnit) {
            if (original != null && original.indexOf(baseUnit) != -1) //TODO SCASTRO please review.
            {
                original = original.replace(baseUnit, conversionUnit);
                return false;
            }
        });
    }
    return original;
}


//Converts standard js date format rules into a different set of format rules
//(this is necessary because jquery's datepicker uses its own date formatting logic
//with its own formatting rules)
function convertDateFormat(original, conversionUnits) {
    return convertByMapping(original, conversionUnits);
}

//Sets the proper date format for an input field's alert message in case of failed validation
function setDateValidation(field, rules, i, options) {
    var dateInput = field[0];
    var dateFormat = '';
    if (dateInput.hasAttribute('data-date-format')) {
        dateFormat = dateInput.getAttribute('data-date-format');
    }

    var timeFormat = '';
    if (dateInput.hasAttribute('data-time-format')) {
        timeFormat = dateInput.getAttribute('data-time-format');
    }

    var dateAndTimeFormats = '';
    if (dateFormat && timeFormat) {
        dateAndTimeFormats = dateFormat + " " + timeFormat;
    } else if (dateFormat && !timeFormat) {
        dateAndTimeFormats = dateFormat;
    } else if (!dateFormat && timeFormat) {
        dateAndTimeFormats = timeFormat;
    }

    var inputDate = moment(field.val(), dateAndTimeFormats);
    if (!inputDate.isValid() && field.val() != '') {
        var customRule = rules.indexOf('custom');
        return String.format(options.allrules[rules[customRule + 1]].alertText, dateAndTimeFormats);
    }
}

function setFaxUploadValidation(field, rules, i, options) {
    var fileInput = field[0];
    var fileTypes = fileInput.getAttribute('data-file-types').split(',');
    for (var index = 0; index < fileTypes.length; ++index) {
        fileTypes[index] = fileTypes[index].trim().replace(/\./g, '');
    }
    var regex = new RegExp('\.(?:' + fileTypes.join('|') + ')$','i');
    if (!regex.test(field.val())) {
        $('.saving').prop('disabled', true);
        return '* Invalid file type';
    }
    $('.saving').prop('disabled', false);
}

// function bindJsDebug() {
//  if($('#js-debug-btn').length) {
//      var iconClass = (jsdebug ? 'icon-eye-open' : 'icon-eye-close');

//      $('#js-debug-btn i').attr('class', '').addClass(iconClass);

//      $('#js-debug-btn').off('click').on('click', function(){
//          if(jsdebug) {
//              log('disabled javascript log');
//              setJsDebug(false);
//              $('#js-debug-btn i').attr('class', '').addClass('icon-eye-close');
//          }
//          else {
//              setJsDebug(true);
//              $('#js-debug-btn i').attr('class', '').addClass('icon-eye-open');
//              log('enabled javascript log');
//          }
//      });
//  }
// }

var checkSessionTimeout;
function checkSession(secondAttempt) {
    if (typeof secondAttempt == 'undefined') secondAttempt = false;

    if (secondAttempt) log("checkSession secondAttempt");
    else log("checkSession");

    if (window.location.pathname == '/portal/login/index') {
        if (checkSessionTimeout) {
            clearTimeout(checkSessionTimeout);
        }
        return;
    }

    $.get('/portal/home/checkSession', function (data) {
        if (typeof data != 'undefined' && data.trim() != "ok") {
            if (secondAttempt)
            {
                if (checkSessionTimeout) {
                    clearTimeout(checkSessionTimeout);
                }
                forceLogout();
                return;
            }
            setTimeout(function () {
              checkSession(true);
            },5000);
        } else {
            if (checkSessionTimeout) {
                clearTimeout(checkSessionTimeout);
            }
            checkSessionTimeout = setTimeout(function () {
                checkSession();
            }, 300000);
        }
    })
    .fail(function() {
        if (secondAttempt)
        {
            if (checkSessionTimeout) {
                clearTimeout(checkSessionTimeout);
            }
            forceLogout();
            return;
        }
        if (checkSessionTimeout) {
            clearTimeout(checkSessionTimeout);
        }
        setTimeout(function () {
            checkSession(true);
        },5000);
    });

}

setInterval(function () {
  if (!checkSessionTimeout) {
    checkSessionTimeout = setTimeout(function () {
        checkSession();
    }, 180000);
  }
},300000);

function forceLogout() {
    window.location = "/portal/login/logout/expired";
    return;
}

$(document).on('click', '#logout', function () {
    localStorage.removeItem('openChats');
});

function printDiv(divId) {
    var cssLink = '<link rel="stylesheet" type="text/css" href="/portal/css/myprintstyle.css">';

    window.frames["print_frame"].document.body.innerHTML = cssLink + $("#" + divId).html();
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
}

/**
 * print a call center report
 **/
function printReport() {
    log('printReport');
    var css = '<link id="print-styles" rel="stylesheet" type="text/css" href="/portal/css/myprintstyle.css">';
    var dateFrom = $('#modal-from-0').attr('data-raw-date');
    var dateTo = $('#modal-to-0').attr('data-raw-date');
    var type = $("#stat_type option[value='" + $('#stat_type').val() + "']").text();
    var title = '<h2>' + type + ': ' + dateFrom + ' &mdash; ' + dateTo + '</h2>';
    var graphTitle = '<h3>' + $('#graph-type-label').text() + ' Graph</h3>';
    var $tableBody = $('#modal-table-div .dataTables_scrollBody tbody')[0].outerHTML;
    var $tableHeader = $('#modal_stats_table_wrapper .dataTables_scrollHead thead')[0].outerHTML;
    var $tableFoot="";
    if ($('#modal-table-div .dataTables_scrollBody tfoot').length)
      $tableFoot = $('#modal-table-div .dataTables_scrollBody tfoot')[0].outerHTML;
    var $statsTable = '<table class="table table-condensed table-hover table-bordered dataTable">' + $tableHeader + $tableBody + $tableFoot+ '</table>';
    var html = title + graphTitle + $('#modal-graph-div').html() + $statsTable;

    printFrame(css, html);
}

/**
 * center a modal on screen based on dimensions. trace modals resize width as well as height.
 *
 * @param {string} css is the link html for css
 * @param {string} html is the content to be printed
 **/
function printFrame(css, html) {
    log('printFrame');

    window.frames["print_frame"].document.head.innerHTML = css;
    window.frames["print_frame"].document.body.innerHTML = html;

    // fetch print css file and wait for it to load before printing

    $("[name='print_frame']").contents().find("#print-styles").on("load", function() {
      window.frames["print_frame"].window.focus();
      window.frames["print_frame"].window.print();
    });
}

/**
 * center a modal on screen based on dimensions. trace modals resize width as well as height.
 *
 * @param {jquery object} modal object to resize
 * @param {boolean} trace indicates if the modal contains a trace
 **/
function modalResize(modal, trace) {
    log('modalResize');

    //hide validation popups because they don't scroll with resize
    $('form').validationEngine('hideAll');

    //collect element heights
    var modalHeaderHeight = modal.find('.modal-header').outerHeight(true);
    var modalFooterHeight = modal.find('.modal-footer').outerHeight(true);
    var windowHeight = $(window).height();

    //combined height of modal header and footer (~150) plus some margin (2x the mask bar)
    var heightOffset = modalHeaderHeight + modalFooterHeight + 160;
    var marginOffset = 0;

    //check if domain editing message is shown and adjust offsets
    if ($('#domain-message').length) {
        var domainMsgHeight = $('#domain-message').outerHeight();

        heightOffset += domainMsgHeight;
        marginOffset = domainMsgHeight / 2;
    }

    if ($('.modal-header-settings').length) {
        var modalSettingsHeight = $('.modal-header-settings').outerHeight();

        heightOffset += modalSettingsHeight;
    }

    //add dock header height to offsets
    heightOffset += 33;
    marginOffset -= 16;

    modal.find('.modal-body').css({'max-height': (windowHeight - heightOffset)});
    modal.find('.modal-body .modal-body-flex-container').css({'max-height': (windowHeight - heightOffset)});

    //calculate negative vertical margin to center modal
    var modalHeight = modal.outerHeight();

    var marginTop = ((modalHeight / 2) * -1 + marginOffset);
    modal.css({marginTop:marginTop });


    //calculate negative horizontal margin to center modal

    if (trace)
        modal.css({marginLeft: ((modal.outerWidth() / 2) * -1)});


    //log('modal outerHeight: ' + modalHeight);
    //log('vertical margin: ' + ((modalHeight / 2) * -1 + marginOffset));
    //log('modal-body max height: ' + (windowHeight - heightOffset));
}

/**
 * adjusts contacts dock max-height based on window height.
 *
 **/
function contactsResize() {
    var dockContacts = $('.dock-contacts');
    var maxHeight = 250;

    //grab heights of window, contacts headers, footer
    var windowHeight = $(window).height();
    var dockHeadHeight = dockContacts.find('.dock-head').outerHeight();
    var contactsHeadHeight = dockContacts.find('.dock-contacts-header').outerHeight();
    var contactsGroupsHeight = dockContacts.find('.groups-container').outerHeight();
    var domainHeight = 0;

    //check if domain editing message is shown and adjust offset
    if ($('#domain-message').is(':visible')) {
        domainHeight = 50;
    }

    //subtract headers/footers heights from window height, plus some margin and give max-height to contacts scroll container
    //double contactsGroupsHeight because of contacst/recent toggle
    maxHeight = windowHeight - dockHeadHeight - contactsHeadHeight - contactsGroupsHeight - contactsGroupsHeight - domainHeight - 20;

    dockContacts.find('.scroll-container').css('max-height', maxHeight + 'px');
}

/**
 * decide whether to make a dropdown go up instead of down (default)
 *
 * @param {object} el should be the element that toggles the dropdown
 */
function getDropdownDirection(el) {
    var $dropdown = $(el).next('.dropdown-menu')
    // Invisibly expand the dropdown menu so its true height can be calculated
    $dropdown.css({
        visibility: "hidden",
        display: "block"
    });

    // Necessary to remove class each time so we don't unwantedly use dropup's offset top
    $(el).parent().removeClass("dropup");

    // Determine whether bottom of menu will be below window at current scroll position
    if ($dropdown.offset().top - $(el).scrollParent().offset().top - $(el).scrollParent().scrollTop() + $dropdown.outerHeight() > $(el).scrollParent().innerHeight() - $(el).scrollParent().scrollTop()) {
        $(el).parent().addClass("dropup");
    }

    // Return dropdown menu to fully hidden state
    $dropdown.removeAttr("style");
}

/**
 * minimize a dock popup and save position of dock-contacts in a cookie
 *
 * @param {object} el is either the dock-minimize button or the dock-header
 */
function minimizeDockPopup(el) {
    var dockBody = $(el).parents('.dock-head').siblings('.dock-body');
    var isContactsDock = $(el).parents('.dock-column').hasClass('dock-contacts');
    var position = 'Dock.positon';
    if (dockBody.is(':visible')) {
        dockBody.hide();
        $(el).parents('.dock-column').find('.dock-minimize i').removeClass('icon-minimize').addClass('icon-maximize').attr('title', _('Maximize'));
        if (isContactsDock) {
            localStorage.setItem('DockPosition', 'hidden');
            $.cookie(position, 0, {
                expires: 365,
                path: '/'
            });
            $.cookie(position, 0, {
                expires: 365,
                path: '/portal/'
            });
        } else {
            // add sessionid to hiddenChatBoxes
            let session_id = $(el).closest('.uc-message-box-column').data('session');
            var old = localStorage.getItem('hiddenChatBoxes');
            if(old === null) old = "";
            localStorage.setItem('hiddenChatBoxes', old + session_id);
        }

    } else {
        dockBody.show();
        $(el).parents('.dock-column').find('.dock-minimize i').removeClass('icon-maximize').addClass('icon-minimize').attr('title', _('Minimize'));
        contactsResize();

        if (isContactsDock) {
            localStorage.setItem('DockPosition', 'show');
            $.cookie(position, 1, {
                expires: 365,
                path: '/'
            });
            $.cookie(position, 1, {
                expires: 365,
                path: '/portal/'
            });
        } else {
            // remove sessionid from hiddenChatBoxes
            let session_id = $(el).closest('.uc-message-box-column').data('session');
            var old = localStorage.getItem('hiddenChatBoxes');
            if(old === null) old = "";
            old = old.replaceAll(session_id, '');
            localStorage.setItem('hiddenChatBoxes', old);
        }
    }
}

/**
 * bind accordion slide to chevron icon
 *
 **/
function bindAccordionSlide() {
    $('.accordion-body').each(function () {
        $(this).on('show', function () {
            $(this).siblings('.accordion-heading').find('.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
        });
        $(this).on('shown', function () {
            $(this).parents('.modal').trigger('resize');
        });
        $(this).on('hide', function () {
            $(this).siblings('.accordion-heading').find('.icon-chevron-down').removeClass('icon-chevron-down').addClass('icon-chevron-up');
        });
        $(this).on('hidden', function () {
            $(this).parents('.modal').trigger('resize');
        });
    });
}

/**
 * initialize bootstrap tooltips on elements with 'helpsy' class
 *
 **/
function initTooltips() {

    function tooltipTop(element) {
        return element.tooltip({
            delay: {show: 400, hide: 100},
            container: 'body'
        }).on('hidden', function (e) {
            e.stopPropagation();
        });
    }

    function tooltipRight(element) {
        return element.tooltip({
            placement: 'right',
            delay: {show: 400, hide: 100},
            container: 'body'
        }).on('hidden', function (e) {
            e.stopPropagation();
        });
    }

    function tooltipButtom(element) {
        return element.tooltip({
            placement: 'bottom',
            delay: {show: 400, hide: 100},
            container: 'body'
        }).on('hidden', function (e) {
            e.stopPropagation();
        });
    }

    function tooltipLeft(element) {
        return element.tooltip({
            placement: 'left',
            delay: {show: 400, hide: 100},
            container: 'body'
        }).on('hidden', function (e) {
            e.stopPropagation();
        });
    }

    function initOverlay(element) {
        var title = element.attr('data-original-title');
        return $('<div />').addClass('helpsy')
            .attr('title', title)
            .css({
                position: "absolute",
                top: element.position().top,
                left: element.position().left,
                width: element.outerWidth(),
                height: element.outerHeight(),
                zIndex: 1000,
                backgroundColor: "#fff",
                opacity: 0
            });
    }

    // init tooltips
    tooltipTop($('.helpsy'));
    tooltipRight($('.helpsy-right'));
    tooltipButtom($('.helpsy-buttom'));
    tooltipLeft($('.helpsy-left'));

    // init tooltips for disabled buttons
    $('.helpsy:disabled').each(function () {
        var _this = $(this);
        var overlay = initOverlay(_this);
        overlay = tooltipTop(overlay);
        _this.after(overlay);
    });
    $('.helpsy-right:disabled').each(function () {
        var _this = $(this);
        var overlay = initOverlay(_this);
        overlay = tooltipRight(overlay);
        _this.after(overlay);
    });
    $('.helpsy-buttom:disabled').each(function () {
        var _this = $(this);
        var overlay = initOverlay(_this);
        overlay = tooltipButtom(overlay);
        _this.after(overlay);
    });
    $('.helpsy-left:disabled').each(function () {
        var _this = $(this);
        var overlay = initOverlay(_this);
        overlay = tooltipLeft(overlay);
        _this.after(overlay);
    });
}

/**
 * force validation for js -> submit method. initiate button loading if applicable
 *
 **/
function forceValidate(form) {
    log('forced validation on ' + form);
    var validated = $(form).validationEngine('validate');
    //var validated = true;

    if (validated) {
        $(form + ' .saving').button('loading');
        return true;
    } else
        return false;
}

//attach validationEngine to forms
function attachValidation() {
    $('form').validationEngine('attach', {
        autoHidePrompt: true,
        scroll: false,
        onValidationComplete: function (form, status) {
            if (status) {
                log('validationEngine: passed');
                $('.saving').button('loading');
                return true;
            } else {
                log('validationEngine: failed');
                return false;
            }
        },
        onFailure: function () {
            log('onFailure');
        }
    });

    //delay validation on keyup for password
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    $('#confirm-new-password').keyup(function () {
        delay(function () {
            $('form').validationEngine('validateField', "#confirm-new-password");
        }, 1000);
    });

    //clicking cancel button hides red notifications
    $('.cancel').click(function () {
        $('form').validationEngine('hideAll');
        //hideModal('.modal:visible');
    });
    $('ul.nav a').click(function () {
        $('form').validationEngine('hideAll');
    });

    //losing autcomplete field focus hides notification
    $('#choices').blur(function () {
        $('#choices').validationEngine('hidePrompt');
    });

    // This might not be necessary since hidden and disabled fields don't seem to validate anyway.
    // Left it here just in case.
    //
    //$('input:radio').click(function(){
    //  if ($('#TimeframeSelectOption2').prop('checked')){
    //    $('input:checkbox').change(function(){
    //      if ($('#' + this.id).prop('checked')) {
    //        $('.' + this.id).addClass('validate[required,custom[time]]');
    //        $('form').validationEngine();
    //      }
    //      else {
    //        $('.' + this.id).removeClass('validate[required,custom[time]]');
    //        $('form').validationEngine();
    //      }
    //    });
    //  }
    //});

    //hide any error prompts if a new radioSlide option is selected
    $('.radioSlide').change(function () {
        $('.datepicker').validationEngine('hidePrompt');
        $('.input-hour-minute').validationEngine('hidePrompt');
        dayOfWeekCheck();
    });

    //unbind the blur event from datepicker fields to prevent unwanted validation until form is submitted.
    $('.datepicker, .datetimepicker').unbind('blur');
}

//toggle slidedown of add time frame options
function radioSlide() {
    //show selected radio option div on edit
    $('input.radioSlide:checked').each(function () {
        var selected = $(this).val();
        $('#' + selected).show();

    });

    //show selected radio options when clicking each radio
    $('input.radioSlide').change(function () {
        var selected = $(this).val();

        if (selected == 'option1')
            $('.timeframe-divider').fadeOut();
        else
            $('.timeframe-divider').fadeIn();

        $('.slide').animate({
            height: "hide", opacity: "hide"
        }, {
            progress: function () {
                //if (selected == 'option1')
                modalResize($(this).parents('.modal'));
            }
        });
        $('#' + selected).animate({
            height: "show", opacity: "show"
        }, {
            progress: function () {
                //if (selected == 'option1')
                modalResize($(this).parents('.modal'));
            }
        });


    });
}

function handleAgentOnlineStatus() {
    let val = $('#agentstatus-value').attr('val');
    if (val == undefined || val == null || val == '') {
        // had to specify because ! wasn't working ???
        reloadModal('#write-agents');
    } else {
      $.post("/portal/agents/agentLog/" + val+'/'+$('#agentstatus-value').attr('user')+'@'+$('#agentstatus-value').attr('queue').split('@')[1], function () {
      })
        .fail(function () {
            console.log('failed to post log update');
        })
        .done(function () {
            reloadModal('#write-agents');
        });
    }
  }

  function agentSetStatusValue(value) {
    let valobj = $('#agentstatus-value');
    if (valobj.attr('isagent') == 'no') return;

    if (value == 'Online' || value == 'Logged In') {
      valobj.attr('val', 'Auto')
    } else if (value == 'Offline' || value == 'Logged Out') {
      valobj.attr('val', 'Manual')
    }
  }

//funtion to show add/edit menu of the agents page
function toggleAgentEdit(device, type, time, priority, order, tier, auto, call_limit, max_sms, confirm_required, offnet, agent_type) {
    if (typeof agent_type == 'undefined' || agent_type === null || agent_type === "")
    {
      if ($('#agent_type').length >0 && $('#agent_type').val() == "subscriber") {
        agent_type = "subscriber";
      } else {
        agent_type = "device";
      }
    }

    var addedit = $('#addedit');

    if (typeof type == 'object')
    {
      if (type.contains("loggedin"))
      {
        type = 'Logged In';
      }
      else {
        type = 'Logged Out';
      }
    }

    if (agent_type == 'subscriber') {
        if (type.includes('Logged In') || type.includes('Online')) $('#agentstatus-value').attr('val','Auto');
        else $('#agentstatus-value').attr('val','Manual');
        $('#agentstatus-value').attr('isagent', 'yes');
    } else $('#agentstatus-value').attr('isagent', 'no');

    $('#CallqueueLoginType').val(type);
    time = time.replace("-", "0");
    $('#agentstatus-value').attr('user',device.split(' ')[0]);

    $('#CallqueueWaitTime').val(time);
    $('#CallqueueWaitTime-slider').slider('value', time / 5);
    $('#CallqueueWaitTime-slider').children(".ui-slider-handle").find("span.slider-tooltip-value").html(time);

    $('#CallqueueCallLimit').val( call_limit);
    $('#CallqueueCallLimit').val(call_limit);
    $('#CallqueueCallLimit-slider').slider('value', call_limit);
    $('#CallqueueCallLimit-slider').children(".ui-slider-handle").find("span.slider-tooltip-value").html(call_limit);

    $('#CallqueueMaxSms').val( max_sms);
    $('#CallqueueMaxSms-slider').slider('value', max_sms);
    $('#CallqueueMaxSms-slider').children(".ui-slider-handle").find("span.slider-tooltip-value").html(max_sms);
    $('#CallqueueMaxSms').val(max_sms);

    priority = priority.replace("-", "1");
    $('#CallqueuePriority').val( priority);
    $('#CallqueuePriority').val(priority);

    order = order.replace("-", "0");
    $('#CallqueueOrder').val( order);
    $('#CallqueueOrder').val(order);


    tier = tier.replace("-", "0");
    $('#CallqueueTier').val( tier);
    $('#CallqueueTier').val(tier);


    $('#agent_type').val( agent_type);
    $('#agent_type').val(agent_type);
    var isEditNow = false;
    if (agent_type == "subscriber" || (showByUser && !showByDevice))
    {
      isEditNow = $('#extension').prop('readonly');
      $('#extension').val( device);
      $('#device').val( "");
      if (device === null || device === "")
          $('#extension').prop('readonly', false);
      else
          $('#extension').prop('readonly', true);

      $('.control-group.group-extension').show();
      $('.control-group.group-device').hide();
    }
    else {
      isEditNow = $('#device').prop('readonly');
      $('#device').val( device);
      $('#extension').val( "");
      if (device === null || device === "")
          $('#device').prop('readonly', false);
      else
          $('#device').prop('readonly', true);

      $('.control-group.group-device').show();
      $('.control-group.group-extension').hide();
    }

    //showAddEdit
    //alert(auto);
    if (auto == "yes" || auto == "Yes")
        $('#auto_answer').prop('checked', true);
    else
        $('#auto_answer').prop('checked', false);

    if (confirm_required == "yes" || confirm_required == "Yes")
        $('#confirm_required').prop('checked', true);
    else
        $('#confirm_required').prop('checked', false);
    //else
    //  $('#auto_answer').prop('checked', 'unchecked');
    //alert($('#auto_answer').prop('checked'));
    //$('#' + selected).slideDown();
    //$('#' + 'addbutton').hide();

    // var bodyHeight = parseInt($('#write-agents').find('.modal-body').css('max-height'));
    //var editHeight = addedit.outerHeight();
    //log('editHeight: ' +editHeight);

    if (device === null || device === "")
    {
      $('#agents-autocomplete').show();
      $('#extensions-autocomplete').show();
      $('#device').hide();
      $('#extension').hide();
      $('.add-agents-by').show();

    }
    else {
      $('#agents-autocomplete').hide();
      $('#extensions-autocomplete').hide();
      $('#device').show();
      $('#extension').show();
      $('.add-agents-by').hide();
    }

    if (isEditNow && addedit.is(':visible')) {
        //do nothing
    } else if (addedit.is(':hidden')) {
        showAgentEdit();
    } else if (device == '' && addedit.is(':visible')) {
        hideAgentEdit();
        $('#agents-autocomplete').hide();
    }

    if (offnet || offnet == "1") {
        hqAgentOffnet(true, type);
    } else {
        hqAgentOffnet(false, type);
    }
}

function showAgentEdit() {
    var bodyHeight = parseInt($('#write-agents').find('.modal-body').css('max-height'));

    $('#addedit .scrollable').css({height: (bodyHeight - 52) * (1 / 2) - 30 + 'px'});
    $('#add-agents-table').animate({height: (bodyHeight - 52) * (1 / 2) - 30 + 'px'}, {duration: 400, queue: false});
    $('#addedit').animate(
        {
            height: 'show'
        }, {
            duration: 400,
            queue: false,
            progress: function () {
                modalResize($(this).parents('.modal'));
            }
        });
}

function hideAgentEdit() {
    var bodyHeight = parseInt($('#write-agents').find('.modal-body').css('max-height'));

    $('#add-agents-table').animate({height: bodyHeight - 40 + 'px'}, {duration: 400, queue: false});
    $('#addedit').animate({height: 'hide'}, {
        duration: 400, queue: false, progress: function () {
            modalResize($(this).parents('.modal'));
        }
    });
}

function toggleSiteManagerScope()
{
  setTimeout(function () {
    if($('#site').length == 0 || $('#site').val() == "")
      $("#UserScope option[value*='Site Manager']").prop('disabled',true);
    else {
      $("#UserScope option[value*='Site Manager']").prop('disabled',false);
    }
  }, 100);
}

/**
 * Function adds jQuery based on whether Agent number is "off net" - 10 digit phone number, indicating outside system
 *
 * @param {boolean} isOffnet
 * @param {string} type
 */
function hqAgentOffnet(isOffnet, type) {
    if (isOffnet) {
        $("#device").attr("class", "large validate[required]");
        $("#remote-agent-label").removeClass("hide");
        $("#group-for-offnet-name").removeClass("hide"); // show offnet name field
        $("#isOffnet").val( "yes");
        $("#CallqueueLoginType").html("<option value=\"Disabled\">" + _('Offline') + "</option><option value=\"offnet\">" + _('Online') + "</option>");
        log(type);
        if (type == "offnet" || type == "Logged In")
            $("#CallqueueLoginType").val( "offnet");
        else
            $("#CallqueueLoginType").val( "Disabled");
        $("#groupforwrap, #group-for-maxcalls, #group-for-priority, #group-for-autoanswer, #group-for-maxsms").addClass("hide");
    } else {
        $("#device").attr("class", "large validate[required,ajax[agentAdd] ]");
        $("#remote-agent-label").addClass("hide");
        $("#group-for-offnet-name").addClass("hide"); // hide offnet name field
        $("#isOffnet").val( "no");
        $("#CallqueueLoginType").html("<option value=\"Logged Out\">" + _('Offline') + "</option><option value=\"Logged In\">" + _('Online') + "</option>"); // REMOVED 1226 <option value=\"Available One Call\">Online: One Call</option>");
        if (type == "Logged In" || type == _('Online') || type =='Online' ) {
            $("#CallqueueLoginType").val( "Logged In");
        } else if (type == "Logged Out" || type == _('Offline') || type =='Offline') {
            $("#CallqueueLoginType").val( "Logged Out");
        } else {
            $("#CallqueueLoginType").val( "Available One Call");
        }
        $("#groupforwrap, #group-for-maxcalls, #group-for-priority, #group-for-autoanswer, #group-for-maxsms").removeClass("hide");
    }
}

function agentsTableHeight(refresh) {
    log('adjusting agents table height');
    var modal = $('#write-agents');
    // modalResize(modal);

    //show hidden modal elements before calculating heights
    //modal.find('.modal-header, .modal-body, .modal-footer').show();

    var bodyHeight = parseInt(modal.find('.modal-body').css('max-height'));

    $('#add-agents-table').css({height: bodyHeight - 20});

    if (refresh)
        modal.find('.modal-header, .modal-footer').fadeIn(25, function () {
            modal.find('.modal-body')
                .css('display', 'block');
            modalResize(modal);
        });
    else
        modal.find('.modal-header, .modal-footer').fadeIn(25, function () {
            modal.find('.modal-body')
                .animate({
                    height: "show", opacity: "show"
                }, {
                    duration: 100,
                    progress: function () {
                        modalResize(modal);
                    }
                });
        });

    //modalResize(modal);
    //workaround to prevent modal hide event from triggering tooltip
    $('.modal').unbind('hide');
}

function enableAgentDelete() {

    alert('test');

    //$(form)[0].CallqueueToDelete.value = "DELETE";
    $('#' + 'CallqueueToDelete').val( "DELETE");

    //var name=prompt("TYPE DELETE","DELE");
    //confirm("sometext");

}

function hideAddEdit(toDelete) {


    var selected = 'addedit';

    $('#' + selected).slideUp();


    //$("form:first").submit('toDelete');

}

function phoneShowOptions(isAdd) {
    if (isAdd != "1")
        isAdd = false;
    else
        isAdd = true;
    //alert($(this).attr('val'));
    var model = $('#PhoneModel').val()
    if (model != "" && model != "Manual or Softphone") {
        $('#' + "macLineDiv").animate({
            height: "show", opacity: "show"
        }, {
            queue: false,
            progress: function () {
                modalResize($(this).parents('.modal'));
            }
        });
        $('#' + "manualDiv").animate({
            height: "hide", opacity: "hide"
        }, {
            queue: false,
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        $('#' + "macLineDiv").animate({
            height: "hide", opacity: "hide"
        }, {
            queue: false,
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
        if (!isAdd)
            $('#' + "manualDiv").animate({
                height: "show", opacity: "show"
            }, {
                queue: false,
                progress: function () {
                    modalResize($(this).parents('.modal'))
                }
            });
    }

}

function greetingFadeCallback(select, selectText = '') {
    if (select == null) {
        var selected = selectText;
    } else {
        var selected = $(select).val();
    }

    if ($('.toggle-placeholder').is(':hidden')) {
        $('.toggle-placeholder').slideDown();
    }

    if ($('.toggle-placeholder .slide').is(':visible')) {
        $('.toggle-placeholder .slide:visible').stop().fadeOut(200, function () {
            $('#' + selected).fadeIn(200);
        });
    } else {
        $('#' + selected).fadeIn(200);
    }

    if ($('#UserSelectUploadFile').prop('checked')) {
        $('.save_button_js').hide();
        $('.save_tts_btn').hide();
        $('.save_button_form').show();
        $('.save_button_form > .btn').val('Upload');
    } else if ($('#UserSelectTextToSpeech').prop('checked')) {
        $('.save_tts_btn').show();
        $('#save_tts_btn').show();
        $('.save_button_form').hide();
        $('.save_button_js').hide();
    } else {
        $('.save_button_form').hide();
        $('.save_tts_btn').hide();
        $('.save_button_js').show();
        $('#save_button_js').show();
        $('.save_button_js > .btn').val('Call');
        $('.save_button_js > .btn').data('loading-text', 'Calling...');
    }
}

function greetingFade() {
    $('#moh00_enabled').click(function () {
        if ($('#MusicSelectRecordNumber').is(':checked')) {
            $('#save-js').show();
            $('#save-form').addClass('hide');
        }
    });

    $(':button[value="Add Greeting"],#moh00_enabled').click(function () {
        if ($(':input[value="record-number"]').is(':checked')) {
            $('input.greetingFade').each(function () {
                greetingFadeCallback(this);
            })
        }
    });

    $('input.greetingFade').change(function () {
        greetingFadeCallback(this)
    });
}



function msgFadeCallback(select, selectText = '') {
    if (select == null) {
        var selected = selectText;
    } else {
        var selected = $(select).val();
    }

    if ($('.toggle-placeholder').is(':hidden')) {
        $('.toggle-placeholder').slideDown();
    }

    if ($('.toggle-placeholder .slide').is(':visible')) {
        $('.toggle-placeholder .slide:visible').stop().fadeOut(200, function () {
            $('#' + selected).fadeIn(200);
        });
    } else {
        $('#' + selected).fadeIn(200);
    }

    if ($('#UserSelectUploadFile').prop('checked')) {
        $('.save_button_js').hide();
        $('.save_tts_btn').hide();
        $('.save_button_form').show();
        $('.save_button_form > .btn').val('Upload');
    } else if ($('#UserSelectTextToSpeech').prop('checked')) {
        $('.save_tts_btn').show();
        $('#save_tts_btn').show();
        $('.save_button_form').hide();
        $('.save_button_js').hide();
    } else {
        // console.log('show save_button_js 1');
        // $('.save_button_form').hide();
        // $('.save_tts_btn').hide();
        // $('.save_button_js').show();
        // $('#save_button_js').show();
        // $('.save_button_js > .btn').val('Call');
        // $('.save_button_js > .btn').data('loading-text', 'Calling...');
    }
}

function msgFade() {
    $('#moh00_enabled').click(function () {
        if ($('#MusicSelectRecordNumber').is(':checked')) {
            $('#save-js').show();
            $('#save-form').addClass('hide');
        }
    });

    $(':button[value="Add Greeting"],#moh00_enabled').click(function () {
        if ($(':input[value="record-number"]').is(':checked')) {
            $('input.msgFade').each(function () {
                msgFadeCallback(this);
            })
        }
    });

    $('input.msgFade').change(function () {
        msgFadeCallback(this)
    });
}



/**
 * calculates and shows or hides table and add/edit div heights
 *
 * @param {integer} index - is the greeting file index
 * @param {string} script - is used for the greeting name
 * @param {boolean} edit - true if editing a greeting
 * @param {string} voice_id - voice id
 * @param {string} voice_language - voice language
 **/
function greetingAddEdit(index, script, edit) {
    var addedit = $('#greetingAddEdit');
    //alert($('#moh00_enabled').prop('checked'));
    $('#UserEditNumber').val( index);

    var bodyHeight = parseInt($('#greetings-modal').find('.modal-body').css('max-height'));
    //var addeditHeight = addedit.outerHeight();
    var addeditHeight = 243; //gave a hard value because outerHeight calculates inconsistently

    //log('addeditHeight: ' +addeditHeight);

    //if editing a greeting do...
    if (edit) {
        //if addedit section is hidden show it
        if (addedit.is(':hidden')) {
            $('#UserGreetingName').val( script);
            $('#messageText').val(script);
            //outerHeight of addEdit div
            $('.greetings-table').animate({height: bodyHeight - addeditHeight + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'show', opacity: 'show'},
                {
                    duration: 550,
                    queue: false
                });
        }
        //otherwise fade section out and in with greeting's values
        else
            addedit.fadeOut(100, function () {
                $('#UserGreetingName').val( script);
                $('#messageText').val(script);
                addedit.fadeIn(100);
            });
    } else {
        //if addedit section is visible and the name value is blank, hide the addedit section
        if (addedit.is(':visible') && $('#UserGreetingName').val() == '') {
            //outerHeight of addEdit div - 20px padding/margin
            $('.greetings-table').animate({height: bodyHeight - 20 + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'hide', opacity: 'hide'},
                {
                    duration: 550,
                    queue: false
                });
        }
        //otherwise if it's visible but has greetings values, fade out/in and overwrite them for a new greeting
        else if (addedit.is(':visible')) {
            addedit.fadeOut(100, function () {
                $('#UserGreetingName').val( script);
                $('#messageText').val(script);
                addedit.fadeIn(100);
            });
        }
        //otherwise just show the addedit section to add a new greeting
        else {
            $('#UserGreetingName').val( script);

            //outerHeight of addEdit div
            $('.greetings-table').animate({height: bodyHeight - addeditHeight + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'show', opacity: 'show'},
                {
                    duration: 550,
                    queue: false
                });
        }


    }
}

//used after clicking 'save' on greeting
function greetingAddEditClose() {
    //alert($('#moh00_enabled').prop('checked'));
    $('#greetingAddEdit').animate({height: 'hide', opacity: 'hide'}, 750);
}

function updateGreetingDD() {
    $.getJSON("/portal/users/greetings/json/" + sub_user + "@" + sub_domain + "/*", function (data) {
        var source = "";
        log(data);

        $.each(data, function (key, val) {
            var isFound = false;
            var totest = val.index + " - " + val.moh_script;

            $('#greeting-select option').each(function () {

                if (totest == $(this).text()) {
                    isFound = true;
                    log("found " + totest);
                }
            });

            if (!isFound) {
                $('#greeting-select').append(
                    $('<option></option>').val(val.remotepath).html(totest)
                );
            }
        });
    });

}

// shows/hides intro greetings sections in AA intro greetings modal
function introsAddEdit(index, script, edit, message) {
    if (typeof message == 'undefined')
      message = "";

    var addedit = $('#greetingAddEdit');
    //alert($('#moh00_enabled').prop('checked'));
    $('#UserEditNumber').val( index);
    $('#UserGreeting').val( index);
    $('#UserTimeFrame').val( script);
    $('#UserTimeFrame2').val( script);
    $('#intro_enabled_changed').val( "1");

    if (script === "") {
        $('#UserTimeFrame').prop("disabled", false);
        $('#UserTimeFrame').attr('class', "xlarge validate[required]");
    } else {
        $('#UserTimeFrame').prop("disabled", true);
        $('#UserTimeFrame').attr('class', "xlarge ");

    }

    $('#messageText').val(message);

    var bodyHeight = parseInt($('#introgreeting-modal').find('.modal-body').css('max-height'));
    //var addeditHeight = addedit.outerHeight();
    var addeditHeight = 243; //gave a hard value because outerHeight calculates inconsistently

    //log('addeditHeight: ' +addeditHeight);

    //if editing a greeting do...
    if (edit) {

        //if addedit section is hidden show it
        if (addedit.is(':hidden')) {
            $('#UserGreetingName').val( script);
            $('#newGreetingTimeframeSelect').val( script);
            $('#newGreetingTimeframeSelect').prop("disabled", true);

            //modal body - addEdit div
            $('.greetings-table').animate({height: bodyHeight - addeditHeight + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'show', opacity: 'show'},
                {
                    duration: 550,
                    queue: false
                });
        }
        //otherwise fade section out and in with greeting's values
        else
            addedit.fadeOut(100, function () {
                $('#UserGreetingName').val( script);
                $('#newGreetingTimeframeSelect').val( script);
                $('#newGreetingTimeframeSelect').prop("disabled", true);
                addedit.fadeIn(100);
            });
    } else {
        $('#newGreetingTimeframeSelect').prop("disabled", false);
        //if addedit section is visible and the name value is blank, hide the addedit section
        if (addedit.is(':visible') && $('#UserTimeFrame').val() == '') {
            //modal body - 20px padding/margin
            $('.greetings-table').animate({height: bodyHeight - 20 + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'hide', opacity: 'hide'},
                {
                    duration: 550,
                    queue: false
                });
        }
        //otherwise if it's visible but has greetings values, fade out/in and overwrite them for a new greeting
        else if (addedit.is(':visible')) {
            addedit.fadeOut(100, function () {
                $('#UserGreetingName').val( script);
                $('#newGreetingTimeframeSelect').val( script);
                addedit.fadeIn(100);
            });
        }
        //otherwise just show the addedit section to add a new greeting
        else {
            $('#UserGreetingName').val( script);
            $('#newGreetingTimeframeSelect').val( script);
            //modal body - addEdit div
            $('.greetings-table').animate({height: bodyHeight - addeditHeight + 'px'},
                {
                    duration: 550,
                    queue: false
                });
            addedit.animate({height: 'show', opacity: 'show'},
                {
                    duration: 550,
                    queue: false
                });
        }
    }
}

//used after clicking 'save' on greeting
function introsAddEditClose() {
    //alert($('#moh00_enabled').prop('checked'));
    $('#greetingAddEdit').animate({height: 'hide', opacity: 'hide'}, 750);
}

//calculates table height on modal load and display
//form is a boolean that indicates if the greetingstable is being loaded after an ajax form submit
function greetingsTableHeight(form) {
    log('adjusting greetings table height');

    if ($('#introgreeting-modal').length)
        var modal = $('#introgreeting-modal');
    else
        var modal = $('#greetings-modal');

    modalResize(modal);
    //show hidden modal elements before calculating heights
    //modal.find('.modal-header, .modal-body, .modal-footer').show();

    var addedit = $('#greetingAddEdit');
    var bodyHeight = parseInt(modal.find('.modal-body').css('max-height'));
    //var addeditHeight = addedit.outerHeight() + 10; //10 added because outerHeight misses some margin from a field
    var addeditHeight = 233;


    if (addedit.hasClass('nohide'))
        $('.greetings-table').css({height: bodyHeight - addeditHeight - 20}); //outerHeight of addEdit div - 20px padding
    else
        $('.greetings-table').css({height: bodyHeight - 20});

    if (form)
        modal.find('.modal-header, .modal-body, .modal-footer').fadeIn(25);
    else
        modal.find('.modal-header, .modal-footer').fadeIn(25, function () {
            modal.find('.modal-body')
                .animate({
                    height: "show", opacity: "show"
                }, {
                    duration: 100,
                    progress: function () {
                        modalResize(modal);
                    }
                });
        });


    modalResize(modal);

    //workaround to prevent modal hide event from triggering tooltip
    $('.modal').unbind('hide');
}

function toggleMoh0() {
    //alert($('#moh00_enabled').prop('checked'));

    if ($('#moh00_enabled').prop('checked'))
        $("#moh0manage").animate({
            height: 'show', opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'));
            }
        });
    else {
        $("#moh0manage").animate({
            height: 'hide', opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'));
            }
        });
        $("#upload_div, #record_div").hide();
    }
}

function showUpload() {
    $("#record_div").hide();
    $("#upload_div").show();
}

function showRecord() {
    $("#upload_div").hide();
    $("#record_div").show();
}

function saveNoAnsTimeout() {
    //alert("saving");

    //var selected = 'submittimeout';

    //$('#' + selected).submit();
    //$("form:first").submit(); //dead code
    //$('.slide').slideDown();
    //$('#' + selected).slideUp();

    //for (counter=0; counter<$(form).length; counter++)
    //  alert($(form)[counter]);


    //alert($(form).toString());
    //$(form)[0].submit();


}

function showMoreTZoptions() {
    var selectString = '#UserTimeZone';
    var mySelect = $(selectString);

    if (typeof mySelect == 'undefined' || mySelect.length == 0) {
        selectString = '#DomainTimeZone';
        mySelect = $(selectString);
    }

    if (mySelect.val() == "show more...") {
        var optVals = [];
        $(selectString + 'Storage option').each(function () {
            if ($(this).val() != "")
                optVals.push($(this).val());
        });

        $.each(optVals, function (val, text) {
            mySelect.append(
                $('<option></option>').val(text).html(text)
            );
        });
        $(selectString).find("option").attr("selected", false);
        $(selectString + " option[value='show more...']").remove();
    }
}


function addLocationToggle() {
    // reveal the duplicate location inputs
    // change the button to be x helpsy instead
    // if it is to show
    if ($('#add-location').hasClass('add-state')) {
        showAddLocation();
    } else {
        // cancel Add Location
        hideAddLocation();
    }
}


function showAddLocation() {
    $('.address-duplicate-control-group').removeClass('hide');
    $('#add-location').removeClass('add-state');
    // $('#add-location').addClass('del');

    // change help text to "Cancel"
    $("#add-location").text(_('Cancel'));

    // hide the original dropdowns
    $('.address-control-group').addClass('hide');
    $('.address-control-group-notify').addClass('hide');

    // hide Edit Address button
    $('#edit-address').addClass('hide');
    $('#delete-address').addClass('hide');

    modalResize($('.address-control-group').parents('.modal'));
    modalResize($('.address-control-group-notify').parents('.modal'));
}


function hideAddLocation() {
    $('#address_name_duplicate').val('');
    $('#location_duplicate').val('');

    $('.address-duplicate-control-group').addClass('hide');
    // $('#add-location').removeClass('del');
    $('#add-location').addClass('add-state');
    $("#add-location").text(_('Add location description'));

    // show the original dropdowns IF the value is add an address
    if ($("#address_id").val() == "add_address_id") {
        $('.address-control-group').removeClass('hide');
        $('.address-control-group-notify').removeClass('hide');
    }

    // see if should show edit address
    var value = $("#address_id").val();
    if (addressesJS != undefined && Array.isArray(addressesJS) && addressesJS['0'] != undefined && value != undefined) {
        // get the address chosen from dropdown from the list of all addresses
        let chosenAddress = addressesJS.find(o => o.address_id === value);

        // set the address pretty print help text to the chosen address
        if (chosenAddress != undefined) {
            // only show address if the address belongs to the current logged in user (this is so that you cannot dox someone else by looking at their profile)
            if (chosenAddress['user'] == "*" || chosenAddress['user'] == userSite || chosenAddress['domain_level'] != undefined || chosenAddress['site_level'] != undefined || chosenAddress['user'] == sub_user) {
                $('#address_pretty_print').text(chosenAddress['pretty_print']);

                // TODO also show edit options only show edit option if it is user level..
                if (chosenAddress['domain_level'] != undefined || chosenAddress['site_level'] != undefined) {
                    $('#delete-address').addClass('hide');
                    $('#edit-address').addClass('hide');
                } else {
                    $('#edit-address').removeClass('hide');
                    $('#delete-address').removeClass('hide');
                }
            }
        }
    }
    modalResize($('.address-control-group').parents('.modal'));
    modalResize($('.address-control-group-notify').parents('.modal'));
}



// shows more options for address adding for various add/edit routes
function showAddressAddProfile(value, addressesJS = undefined, userSite = undefined) {
    cancelAddressEdit();
    hideAddLocation();
    if (value == 'add_address_id') {
        $('.address-control-group').removeClass('hide');
        $('.address-control-group-notify').removeClass('hide');
        // disable save button for now
        $('.saveBtn').prop('disabled', true);

        // show the validate button
        $('.valBtn').removeClass('hide');

        // resize modal
        modalResize($('.address-control-group').parents('.modal'));
        modalResize($('.address-control-group-notify').parents('.modal'));

        // hide/reset any duplicate prompts that might be showing if you change to add_address option
        $('#address_name_duplicate').val('');
        $('#location_duplicate').val('');
        $('.address-duplicate-control-group').addClass('hide');
        $('#add-location').addClass('add-state');
        $("#add-location").text(_('Add location description'));
        $('#address_pretty_print').text('');

        // hide buttons for Add my location and Edit Address
        $('#add-location').addClass('hide');
        $('#edit-address').addClass('hide');
        $('#delete-address').addClass('hide');

        // make all the fields blank
        $('#address_name').val('');
        $('#caller_name').val('');
        $('#address_line_1').val('');
        $('#address_line_2').val('');
        $('#state_code').val('');
        $('#city').val('');
        $('#zip').val('');
        $('#location').val('');
    } else {
        // $('.address-control-group').addClass('hide');
        // enable save button for now
        $('.saveBtn').prop('disabled', false);

        // hide the validate button
        $('.valBtn').addClass('hide');

        // set the help text too
        $("#validate-address-message").removeClass("text-success").text(_('Validate a new address before saving. All fields must be filled out before validating.'));

        // resize modal
        modalResize($('.address-control-group').parents('.modal'));
        modalResize($('.address-control-group-notify').parents('.modal'));


        // // changed to a non-address value, can read and fill in the address information into the boxes, and also show the
        // if (addressesJS != undefined && Array.isArray(addressesJS) && addressesJS['0'] != undefined) {
        //     // show pretty print here
        //     let chosenAddress = addressesJS.find(o => o.address_id === value);

        //     // set the address pretty print help text to the chosen address
        //     if (chosenAddress != undefined) {
        //         $('#address_pretty_print').text(chosenAddress['pretty_print']);
        //     }
        // }
    }

    // changed to a non-address value, can read and fill in the address information into the boxes, and also show the
    // show pretty print here
    if (addressesJS != undefined && Array.isArray(addressesJS) && addressesJS['0'] != undefined) {
        // get the address chosen from dropdown from the list of all addresses
        let chosenAddress = addressesJS.find(o => o.address_id === value);

        // set the address pretty print help text to the chosen address
        if (chosenAddress != undefined) {
            // only show address if the address belongs to the current logged in user (this is so that you cannot dox someone else by looking at their profile)
            if (chosenAddress['user'] == "*" || chosenAddress['user'] == userSite || chosenAddress['domain_level'] != undefined || chosenAddress['site_level'] != undefined || chosenAddress['user'] == sub_user) {
                $('#address_pretty_print').text(chosenAddress['pretty_print']);

                // TODO also show edit options only show edit option if it is user level..
                if (chosenAddress['domain_level'] != undefined || chosenAddress['site_level'] != undefined) {
                    $('#edit-address').addClass('hide');
                    $('#add-location').removeClass('hide'); // if it is domain/site level, always show the add location
                } else {
                    $('#edit-address').removeClass('hide');
                }


                if (chosenAddress['user'] == sub_user) {
                    $('#add-location').addClass('hide');
                }

                // fill in the values
                fillInAddressData(chosenAddress);
            } else {
                $('#address_pretty_print').text(_('Address is hidden for privacy'));
            }
        } else {
            $('#address_pretty_print').text('');
        }
    }
}



// press edit address, should change edit flag to true
// change the string of the button to be "Cancel"
// show the address information fields
function editAddressToggle () {
    var editFlagEle = document.getElementById("edit_flag");
    if (!editFlagEle) {
        return;
    }

    if (document.getElementById("edit_flag").value == "false") {
        // toggling to true (Pressed Edit address)
        startAddressEdit();
    } else if (document.getElementById("edit_flag").value == "true") {
        // toggling to false (Pressed Cancel)
        cancelAddressEdit();
    }
}


function startAddressEdit() {
    // toggling to true (Pressed Edit address)
    document.getElementById("edit_flag").value = "true";

    // show the inputs
    $('.address-control-group').removeClass('hide');
    $('.address-control-group-notify').removeClass('hide');


    // value is the address_id that is currently selected
    let value = document.getElementById("address_id").value;
    let chosenAddress = addressesJS.find(o => o.address_id === value);

    if (chosenAddress != undefined) {
        fillInAddressData(chosenAddress);
    }

    // change "Edit Address" link text to "Cancel"
    $('#edit-address').text(_('Cancel'));

    // hide Add my location button
    $('#add-location').addClass('hide');


    // hide pretty print
    $('#address_pretty_print').addClass('hide');

    // make sure save is disabled anymore on edit
    $('.saveBtn').prop('disabled', true);

    // show validate button
    $('.valBtn').prop('disabled', false).show();

    modalResize($('.address-control-group').parents('.modal'));
    modalResize($('.address-control-group-notify').parents('.modal'));
}

function cancelAddressEdit() {
    // toggling to false (Pressed Cancel)
    var editFlagEle = document.getElementById("edit_flag");
    if (editFlagEle) {
        editFlagEle.value = "false";
    }

    // hide the inputs
    $('.address-control-group').addClass('hide');
    $('.address-control-group-notify').addClass('hide');

    // change "Cancel" link text BACK to "Edit Address"
    $('#edit-address').text(_('Edit Address'));

    // bring back Add my location description button
    // $('#add-location').removeClass('hide');

    // reveal pretty print again
    $('#address_pretty_print').removeClass('hide');

    // make sure save is not disabled anymore on cancel edit
    $('.saveBtn').prop('disabled', false);

    modalResize($('.address-control-group').parents('.modal'));
    modalResize($('.address-control-group-notify').parents('.modal'));
}


function fillInAddressData(chosenAddress) {
    document.getElementById("address_name").value = chosenAddress['address_name'];
    document.getElementById("caller_name").value = chosenAddress['caller_name'];
    document.getElementById("address_line_1").value = chosenAddress['address_line_1'];
    document.getElementById("address_line_2").value = chosenAddress['address_line_2'];
    document.getElementById("country_code").value = chosenAddress['country_code'];
    document.getElementById("state_code").value = chosenAddress['state_code'];
    document.getElementById("city").value = chosenAddress['city'];
    document.getElementById("zip").value = chosenAddress['zip'];
    if (typeof chosenAddress['location'] != 'undefined' && document.getElementById("location") != null) {
        document.getElementById("location").value = chosenAddress['location'];
    }
    document.getElementById("carrier").value = chosenAddress['carrier'];
}


// should require validate again because the user changed the address to be added
function domainAddressChange(value) {
    // disable the save button
    $('.saveBtn').prop('disabled', true);

    isSaveValidDomain();
    // check if values are filled, if they are, then set validate button to be true
}

function isSaveValidDomain() {
    var allowValidate = true;
    $( ".isNeededDomain" ).each(function( index ) {
        if ($(this).val() =="") {
            allowValidate = false;
        }
    });

    if (allowValidate) {
        $('.valBtn').prop('disabled', false).show();
        $('#validate-address-message')
            .addClass('muted')
            .removeClass('text-error text-success')
            .text(_('Validate a new address before saving. All fields must be filled out before validating.'));

    } else {
        $('.valBtn').prop('disabled', true);
    }
}



// should require validate again because the user changed the address to be added
function userAddressChange(value) {
    // disable the save button
    $('.saveBtn').prop('disabled', true);

    isSaveValid();
    // check if values are filled, if they are, then set validate button to be true
}

//make sure all address fields are filled before allowing to validate
function isSaveValid() {
    var allowValidate = true;
    $( ".isNeeded" ).each(function( index ) {
        if ($(this).val() =="")
            allowValidate = false;

    });

    if (allowValidate) {
        $('.valBtn').prop('disabled', false).show();
        $('#validate-address-message')
            .addClass('muted')
            .removeClass('text-error text-success')
            .text(_('Validate a new address before saving. All fields must be filled out before validating.'));

    } else {
        $('.valBtn').prop('disabled', true);
    }
}


//clears forms and hides sliding content
function clearForm(form) {
    $(form)[0].reset();
    $('li[id*="slide"]').remove();
    findCheck();
    $(':text').blur();
}

//hide modal modalId includes the #
function hideModal(modalId) {
    modalState = 'closing';
    var $modal = $(modalId);

    $('form').validationEngine('hideAll');

    modalTimer = setTimeout(function () {
        if ($modal.is(':visible'))
            $modal.modal('hide');

        //empty and remove any bound events to elements in modal
        $modal.empty().off("*");
        $modal.html('<div class="loading-container relative" style="top:0;padding: 50px 0;">' +
            '<div class="loading-spinner la-ball-spin-clockwise">' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '</div>' +
            '</div>').attr('style', '');
        $modal.removeClass('load-failed');
        modalState = 'closed';
    }, 1000);

}

//hide agent stats modal used in call center manager
//TODO: convert to take placeholder html, store in string, then use here
function hideAgentModal(modalId) {
    modalState = 'closing';

    if (modalId != "#view-agent-stats")
        return hideModal(modalId);
    $('form').validationEngine('hideAll');
    $(modalId).modal('hide');

    modalTimer = setTimeout(function () {
        $(modalId).html('<div class="modal-header">' +
            '<button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#view-reports\');">&times;</button>' +
            '<h3>&nbsp;</h3>' +
            '</div>' +
            '<div class="split-chart-container">' +
            '<div class="chart-container first-chart">' +
            '<span class="loading-lg chart_div"></span>' +
            '<div id="chart_div" class="chart-container"></div>' +
            '</div>' +
            '<div class="chart-container second-chart">' +
            '<span class="loading-lg chart_div2"></span>' +
            '<div id="chart_div2" class="chart-container"></div>' +
            '</div>' +
            '</div>' +
            '<div class="split-chart-container">' +
            '<div class="chart-container first-chart">' +
            '<span class="loading-lg chart_div3"></span>' +
            '<div id="chart_div3" class="chart-container"></div>' +
            '</div>' +
            '<div class="chart-container second-chart">' +
            '<span class="loading-lg chart_div4"></span>' +
            '<div id="chart_div4" class="chart-container"></div>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#view-reports\');">Close</button>' +
            '</div>').attr('style', '');
        modalState = 'closed';
    }, 1000);
}

//hide modal conditionally
function hideModalIf(modalId) {
    if ($('#hideModal').length) {
        modalState = 'closing';

        log('hiding modal, reload location');

        $(modalId).modal('hide');

        modalTimer = setTimeout(function () {
            $(modalId).html('<span class="loading-lg"></span>').attr('style', '');
            modalState = 'closed';
        }, 1000);

        location.reload(true);
    }
}

function hideModalIfNoReload(modalId) {
    if ($('#hideModal').length) {
        modalState = 'closing';

        log('hiding modal, no reload');

        $(modalId).modal('hide');

        modalTimer = setTimeout(function () {
            $(modalId).html('<span class="loading-lg"></span>').attr('style', '');
            modalState = 'closed';
        }, 1000);
    }
}

//reloads the contents of the modal. Used in save and delete cases where the table contents need to be updated
function reloadModal(modalId) {
    modalState = 'opening';

    var $modalObj = $(modalId);
    var modalPath = $modalObj.data('modal-path');

    $modalObj.html('<span class="loading-lg"></span>');

    modalResize($modalObj);

    $.ajax({
        url: modalPath,
        cache: false
    }).done(function (html) {
        log('reloading modal data succeeded for ' + modalId);

        $modalObj.css("minHeight", $modalObj.height());

        try {
            $modalObj.html(html);
        } catch (err) {
            log("error caught - " + err);
        }

        $modalObj.find('.modal-header, .modal-body, .modal-footer').show();
        modalResize($modalObj);

        //workaround to prevent modal hide event from triggering tooltip
        $modalObj.unbind('hide');

        modalState = 'open';
    }).fail(function (textStatus) {
        $modalObj.addClass('load-failed');
        var html = '<div class="modal-header">'
            + '<button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'' + modalId + '\');">&times;</button>'
            + '<h4>' + textStatus.statusText + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<div class="load-failed">'
            + '<h4>The modal contents failed to load.</h4><h4>Please try again.</h4>'
            + '</div>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="btn" class="cancel btn" data-dismiss="modal" onclick="hideModal(\'' + modalId + '\');">Close</button>'
            + '</div>'
        $modalObj.html(html);
        $modalObj.find('.modal-header, .modal-body, .modal-footer').show();
        modalResize($modalObj);
    });
}

//load content into modal and show it.
function loadModal(modalId, path) {
    modalState = 'opening';
    clearTimeout(modalTimer);

    log('loading modal ' + modalId + ' with data from ' + path);

    var modalObj = $(modalId);
    var isNewModal = modalObj.css('display') != 'block';

    var loadingHtml = '<div class="loading-container relative" style="top:0;padding: 50px 0;">' +
        '<div class="loading-spinner la-ball-spin-clockwise">' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '<div></div>' +
        '</div>' +
        '</div>';

    if (isNewModal) {
        modalObj.html(loadingHtml).addClass('loading');
        modalResize(modalObj);
        $('.helpsy').tooltip('hide');
    }

    modalObj.data('modal-path', path);

    $.ajax({
        url: path,
        cache: false
    }).done(function (html) {
        log('loading modal data succeeded for ' + modalId);
        modalObj.removeClass('loading');

        try {
            modalObj.html(html);
        } catch (err) {
          log("error caught - " + err);
        }

        if (modalId == "#history-trace") {
            log('trying to animate modal width to window');
            var srcImage = $('.callflow-image img');

            modalObj.css("maxHeight", $(window).height() - 30);

            var widthImage = new Image();
            widthImage.onload = function () {
                var imageWidth = widthImage.width;
                modalObj.find('.modal-header, .modal-footer').fadeIn(25, function () {

                    if (imageWidth > 610) {
                        if (imageWidth > ($(window).width() - 20))
                            imageWidth = $(window).width() - 20;
                        modalObj.animate({
                            width: imageWidth
                        }, {
                            duration: 150,
                            queue: false,
                            progress: function () {
                                modalResize(modalObj, true);
                            },
                            complete: function () {
                                modalObj.trigger('modal.animation.end');
                                modalState = 'open';
                            }
                        });
                    }
                    modalObj.find('.modal-body')
                        .animate({
                            height: "show", opacity: "show"
                        }, {
                            duration: 100,
                            queue: false,
                            progress: function () {
                                if (imageWidth < 610)
                                    modalResize(modalObj, true);
                            },
                            complete: function () {
                                if (imageWidth < 610)
                                    modalResize(modalObj, true);
                                modalObj.trigger('modal.animation.end');
                            }
                        });
                });
            };
            widthImage.src = srcImage.attr("src");
        } else {
            modalObj.find('.modal-header, .modal-footer').fadeIn(isNewModal ? 25 : 0);
            modalObj.find('.modal-body')
                .animate({
                    height: "show",
                    opacity: "show"
                }, {
                    duration: isNewModal ? 100 : 0,
                    progress: function () {
                        modalResize(modalObj);
                        $('.helpsy').tooltip('hide');

                    },
                    complete: function () {
                        modalResize(modalObj);
                        $('.helpsy').tooltip('hide');
                        modalObj.trigger('modal.animation.end');
                    }
                });
        }
        // modalObj.css('minHeight', '');

        //workaround to prevent modal hide event from triggering tooltip
        $('.modal').unbind('hide');

    }).fail(function (textStatus) {
        modalObj.removeClass('loading').addClass('load-failed');
        var html = '<div class="modal-header">'
            + '<button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'' + modalId + '\');">&times;</button>'
            + '<h4>' + textStatus.statusText + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<div class="load-failed">'
            + '<h4>The modal contents failed to load.</h4><h4>Please try again.</h4>'
            + '</div>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="btn" class="cancel btn" data-dismiss="modal" onclick="hideModal(\'' + modalId + '\');">Close</button>'
            + '</div>'
        modalObj.html(html);
        modalObj.find('.modal-header, .modal-body, .modal-footer').show();
        modalResize(modalObj);
    });
}

//used for closing the current modal and showing the next modal. Needs current modal id, next modal id and next modal path
function loadNextModal(current, next, path) {
    var currentModal = $(current);
    var nextModal = $(next);

    var currentPath = currentModal.data('modal-path');

    nextModal.data('prev-modal-id', current);
    nextModal.data('prev-modal-path', currentPath);

    currentModal.on('hidden', function () {
        currentModal.html('<span class="loading-lg"></span>');
        modalResize(nextModal);
        nextModal.modal('show');
        loadModal(next, path);
        currentModal.off('hidden');
    });

    currentModal.modal('hide');

}

//load new contents into existing modal. Needs modal id and path to load
function loadModalContent(modal, path) {

}

function showConfReport(conf_id) {
    if ($('#preview-' + conf_id).is(':visible')) {
        $('#participants-' + conf_id).animate({
            height: "hide", opacity: "hide"
        }, function () {
            $('#preview-' + conf_id).hide();
            modalResize($(this).parents('.modal'))
        });
    } else {
        $(".subtable:visible div").animate({height: "hide", opacity: "hide"}, function () {
            $(".subtable").not('#preview-' + conf_id).hide();
        });
        $('#preview-' + conf_id).show();
        $('#participants-' + conf_id).animate({
            height: "show", opacity: "show"
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });

    }
}

$('.date-field').each(function () {
    var widthClass = getFieldWidthClass(this, 80, 120);

    $(this).addClass(widthClass);
});

//dynamic form, date range text field additions
function dynamicDateField() {
    var scntDiv = $('#p_scents');
    var slotsMax = 25;
    var slotsAvailable = [];
    for (i = slotsMax - 1; i >= $('#p_scents li').length; i--) {
        slotsAvailable.push(i);
    }

    scntDiv.on('click', '#addScnt', function () {
        var newClass = $(this).attr('classToAdd');

        $('.helpsy').tooltip('hide');
        if (slotsAvailable.length > 0) {
            slot = slotsAvailable.pop();
            if (views.timeframes.timeformat != '')
                timeformat = 'data-time-format="' + views.timeframes.timeformat + '"';
            else
                timeformat = '';

            var dateFieldsHtml =
                '<li id="slide-' + slot + '">\
              <div class="input-append">\
              <input id="from-' + slot + '" name="data[option3][Timerange][' + slot + '][begin]"\
               class="date-field ' + newClass + ' isFrom" type="text" data-date-format="' + views.timeframes.dateformat + '"\
               ' + timeformat + '/>\
              <input name="data[option3][Timerange][' + slot + '][begin]" type="hidden" id="from-' + slot + '-hidden"  />\
              <span class="add-on"><span class="icon-calendar"></span></span>\
              </div>\
              ' + ' ' + _('to') + ' ' + ' \
              <div class="input-append">\
              <input id="to-' + slot + '" name="data[option3][Timerange][' + slot + '][end]"\
               class="date-field ' + newClass + ' isTo" type="text" data-date-format="' + views.timeframes.dateformat + '"\
               ' + timeformat + '/>\
              <input name="data[option3][Timerange][' + slot + '][end]" type="hidden" id="to-' + slot + '-hidden"/>\
              <span class="add-on"><span class="icon-calendar"></span></span>\
              </div>\
              <a href="#" class="del remScnt helpsy" title="' + _('Remove') + '">' + _('Remove') + '</a></li>';

            $(dateFieldsHtml)
                .appendTo(scntDiv)
                .hide()
                .animate({
                    height: "show", opacity: "show"
                }, {
                    progress: function () {
                        modalResize($(this).parents('.modal'))
                    },
                    complete: function () {
                        initTooltips();
                    }
                });
            newDatePicker(slot);

            $('.date-field').each(function () {
                var widthClass = getFieldWidthClass(this, 80, 120);

                $(this).addClass(widthClass);
            });

            $('.date,.timeTimeFrame,.timeframe').not('hasDatePicker').each(function () {
                var dateFormat = this.getAttribute('data-date-format');

                //if (dateFormat != null)
                //  dateFormat = dateFormat.replace('Do', 'D');

                var timeFormat = this.getAttribute('data-time-format');
                var dateTimeFormat = '';
                if (dateFormat && timeFormat)
                    dateTimeFormat = dateFormat + " " + timeFormat;
                else if (dateFormat && !timeFormat)
                    dateTimeFormat = dateFormat;
                else if (!dateFormat && !timeFormat)
                    dateTimeFormat = timeFormat;

                $(this).change(function () {
                    var newDate = moment(this.value, dateFormat + ' ' + timeFormat);
                    if (newDate.isValid()) {
                        this.value = newDate.format(dateTimeFormat);
                        this.setAttribute('value', newDate.format(dateTimeFormat));
                    }
                });
            });
        } //end if slotsAvailable.length > 0

        return false;
    }); //end #addScnt on click

    scntDiv.on('click', '.remScnt', function () {
        var li = this.parentNode;

        $('.helpsy').tooltip('hide');
        if (li.id != "keep") {
            var modal = $(this).parents('.modal');

            slot = li.id.substr(li.id.lastIndexOf('-') + 1);
            slotsAvailable.push(slot);
            $(this).parent('li').remove();
            modalResize(modal);
        }
        return false;
    });
}

function dynamicField(listId, slotsMax, addId, slideId, type, field, disableClass, effectClass, placeholder, removeClass) {
    var scntDiv = $('#' + listId);
    var slotsAvailable = [];
    for (i = slotsMax - 1; i >= $('#' + listId + ' li').length; i--) {
        slotsAvailable.push(i);
    }


    scntDiv.on('click', '#' + addId, function () {
        if (slotsAvailable.length > 0) {
            slot = slotsAvailable.pop();
            var id = slideId + '-' + slot;
            var simDelay = ($('.sim-delay-btn').length ? true : false);
            var isEmail = (listId.startsWith('email-list') ? true : false);
            var isFaxUser = (listId.startsWith('faxuser-list') ? true : false);
            var isVmailnag = (listId.startsWith('vmailnag-') ? true : false);
            if (isVmailnag) {
                var itemType = slideId.startsWith('phone') ? 'phone' : slideId.startsWith('sms') ? 'sms' : 'email';
            }

            if (simDelay) {
                var $delayDrop = $('.sim-delay-drop:first').clone();
                var fieldHtml = '<li id="' + id + '" style="display:none;">' +
                    '<div class="input-append sim-delay">' +
                    '<input id="answerrule_sim_numbers'+id+'" name="data[' + type + '][' + field + '][' + slot + ']" class="' + disableClass + ' ' + effectClass + '" placeholder="' + placeholder + '" type="text" />' +
                    '<button type="button" class="sim-delay-btn btn helpsy-right cb-simring cb-always-effect cb-dnd-effect" title="Ring Delay (sec)"><i class="icon-time"></i> <span></span></button>' +
                    '</div> ' +
                    '<button type="button" href="javascript:void(0)" id="remove-simring" class="del helpsy ' + removeClass + ' ' + disableClass + ' ' + effectClass + '" title="Delete">Delete</button>' +
                    '<select id="' + type + 'SimDelay' + slot + '" name="data[' + type + '][sim_delay][' + slot + ']" class="sim-delay-drop"></select>' +
                    '</li>';

            } else if (isEmail) {
                var fieldHtml = '<li id="' + id + '" style="display:none;">' +
                    '<input id="UserEmailAddress' + slot + '" name="data[' + type + '][' + field + '][' + slot + ']" class="' + disableClass + ' ' + effectClass + '" placeholder="' + placeholder + '" type="text" />' +
                    '<button type="button" href="javascript:void(0)" class="del helpsy ' + removeClass + ' ' + disableClass + ' ' + effectClass + '" title="Delete">Delete</button></li>';
            } else if (isFaxUser) {
                var fieldHtml = '<li id="' + id + '" style="display:none;">' +
                    '<input id="FaxUsershare' + slot + '" name="data[' + type + '][' + field + '][' + slot + ']" class="' + disableClass + ' ' + effectClass + '" placeholder="' + placeholder + '" type="text" />' +
                    '<button type="button" href="javascript:void(0)" class="del helpsy ' + removeClass + ' ' + disableClass + ' ' + effectClass + '" title="Delete">Delete</button></li>';
            } else if (isVmailnag) {
                var fieldHtml = '<li id="' + id + '" style="display:none;">' +
                    '<input id="UserVmailnag' + itemType.charAt(0).toUpperCase() + itemType.substring(1) + ((itemType == 'phone' || itemType == 'sms') ? 'Nums' : 'Addrs') + slot + '" name="data[' + type + '][' + field + '][' + slot + ']" class="' + disableClass + ' ' + effectClass + '" placeholder="' + placeholder + '" type="text" />' +
                    '<button type="button" href="javascript:void(0)" class="del helpsy ' + removeClass + ' ' + disableClass + ' ' + effectClass + '" title="Delete">Delete</button></li>';
            } else {
                var fieldHtml = '<li id="' + id + '" style="display:none;">' +
                    '<input name="data[' + type + '][' + field + '][' + slot + ']" class="' + disableClass + ' ' + effectClass + '" placeholder="' + placeholder + '" type="text" />' +
                    '<button type="button" href="javascript:void(0)" class="del helpsy ' + removeClass + ' ' + disableClass + ' ' + effectClass + '" title="Delete">Delete</button></li>';
            }

            scntDiv.append(fieldHtml);

            if (simDelay) {
                var $btn = $('#' + id).find('.sim-delay-btn');
                var $dropdown = $('#' + id).find('.sim-delay-drop');
                var $delaySpan = $dropdown.siblings('.input-append').find('.sim-delay-btn span');

                $('.sim-delay-drop:first').children().clone().appendTo("#" + type + "SimDelay" + slot);
                $dropdown[0].selectedIndex = 0;
                $delaySpan.text($dropdown.val());

            }

            $('#' + id).animate({
                height: "show", opacity: "show"
            }, {
                progress: function () {
                    modalResize($(this).parents('.modal'))
                },
                complete: function () {
                    if (simDelay)
                        initSimDelayPopover($btn);

                    initTooltips();
                }
            });


            // auto fill for the new input field, only devices and do not show No Matches Prompt
            if (simDelay)
            {
              $('#answerrule_sim_numbers'+id).attr("spellcheck",false);
              $('#answerrule_sim_numbers'+id).autocomplete(
                {
                  autoFocus: true,minLength: 0,source: function (request, response) {

                  var results = $.ui.autocomplete.filter(userchoicesChoices, request.term);
                  log(results.length);
                  if (!results.length)
                  {
                    // $('#answerrule_sim_numbers'+id).validationEngine("showPrompt",_("* No matches found!"), "red", "bottomLeft", true);
                  } else {
                    $('#answerrule_sim_numbers'+id).validationEngine("hidePrompt");
                  }
                  $('#answerrule_sim_numbers'+id).data("tabblock",false);response(results);
                },select: function(event, ui) {}}
              );

            }

            if (isFaxUser)
            {
              $("#FaxUsershare"+slot).attr("spellcheck",false);
              $("#FaxUsershare"+slot).autocomplete(
                {
                  autoFocus: true,minLength: 0,source: function (request, response) {

                  var results = $.ui.autocomplete.filter(userchoicesChoices, request.term);
                  log(results.length);
                  if (!results.length)
                  {
                    $("#FaxUsershare"+slot).validationEngine("showPrompt",_("* No matches found!"), "red", "bottomLeft", true);
                  } else {
                    $("#FaxUsershare"+slot).validationEngine("hidePrompt");
                  }
                  $("#FaxUsershare"+slot).data("tabblock",false);response(results);
                },select: function(event, ui) {}}
              );

            }
        }


        placeholderInit($('#' + id + ' input'));

        if (isEmail) {
            $('form').validationEngine('detach');
            $('#' + slideId + '-' + slot + ' input').addClass('validate[custom[email]]');
            $('form').validationEngine();
        }

        if (isVmailnag) {
            var $vmailnagElemClass = "validate[custom[email]] emremrecip";
            if (itemType == 'phone') {
                $vmailnagElemClass = "validate[custom[phone]] phremrecip";
            }
            if (itemType == 'sms') {
                $vmailnagElemClass = "validate[custom[phone]] smsremrecip";
            }
            $('form').validationEngine('detach');
            $('#' + slideId + '-' + slot + ' input').addClass($vmailnagElemClass);
            $('form').validationEngine();
        }

        return false;
    });

    scntDiv.on('click', '.' + removeClass, function () {
        li = this.parentNode;
        if (li.id != "keep") {
            var modal = $(this).parents('.modal');

            slot = li.id.substr(li.id.lastIndexOf('-') + 1);
            slotsAvailable.push(slot);

            $(this).tooltip('destroy');
            $(this).parent('li').remove();

            log('removing field');
            modalResize(modal);
        }

        if (removeClass == 'rem-simring') {
            // Read the limit for sim_numbers and see if the number of elements with both 'input-append' and 'sim-delay' classes exceeds it, if so, then hide the add-simring button
            // var limit = 3;
            // Correct the class selector to include both 'input-append' and 'sim-delay'
            var count = $('.input-append.sim-delay').length; // Ensure there is no space between class names
            if (count > max_sim_numbers) {
                console.log('count is more');
                $('#add-simring').hide(); // Hide the button if the count is at or exceeds the limit
            } else {
                console.log('count is less');
                $('#add-simring').show(); // Show the button if the count is below the limit
            }
        }

        return false;
    });
}

$('.hasDatepicker').change(function () {
    if (this.value == '')
        $("[id=" + this.id + "-hidden]").val( "");
});

var bulkEditEnabled = [];//Used to save the state of the checkboxes (if no checkboxes are checked, save button is disabled)
$('.bulk-edit-checkbox').change(function () {
    var enableEdit = $(this).is(':checked');
    inputFieldName = $(this).attr('name');
    inputFieldName = inputFieldName.replace('-checkbox', '');
    inputField = $("[name='" + inputFieldName + "']");
    if (enableEdit) {
        bulkEditEnabled[inputFieldName] = '';
        $('input[value="Save"]').removeAttr("disabled");
        if (inputFieldName == 'data[Phonenumber][enable-date]' || inputFieldName == 'data[Phonenumber][disable-date]') {
            inputField.prop("disabled", false);
            inputField.siblings('.add-on')[0].style.pointerEvents = 'auto';
            if ('data[Phonenumber][enable-date]' in bulkEditEnabled && 'data[Phonenumber][disable-date]' in bulkEditEnabled)
                validateDateRange(inputField.attr('data-date-format'));
        } else if (inputFieldName == 'data[Phonenumber][enable]')
            $('#enable').bootstrapSwitch('disabled', false);
        else if (inputFieldName == 'data[Phonenumber][domain]') {
            inputField.prop("disabled", false);
            $('#PhonenumberApplication').prop("disabled", false);
            val = $('#PhonenumberApplication').val();
            $('#find-' + val).animate({
                height: "show",
                opacity: "show",
            });
        } else
            inputField.prop("disabled", false);
    } else {
        if (inputFieldName == 'data[Phonenumber][enable-date]' || inputFieldName == 'data[Phonenumber][disable-date]') {
            $('#disable-date').validationEngine('hidePrompt');
            $('input[value="Save"]').removeAttr("disabled");
            inputField.prop("disabled", true);
            inputField.siblings('.add-on')[0].style.pointerEvents = 'none';

        } else if (inputFieldName == 'data[Phonenumber][enable]')
            $('#enable').bootstrapSwitch('disabled', true);
        else if (inputFieldName == 'data[Phonenumber][domain]') {
            inputField.prop("disabled", true);
            $('#PhonenumberApplication').prop("disabled", true);
            $('div[id^="find-"]:visible').animate({
                height: "hide",
                opacity: "hide"
            });
        } else
            inputField.prop("disabled", true);

        delete bulkEditEnabled[inputFieldName];
        if (Object.keys(bulkEditEnabled).length === 0)
            $('input[value="Save"]').prop("disabled", true);;
    }

});

function validateDateRange(dateFormat) {
    isFrom = $('.isFrom');
    isTo = $('.isTo');
    if (!isFrom.val() == "" && !isTo.val() == "") {
        var a = moment(isFrom.datepicker('getDate')).unix();
        var b = moment(isTo.datepicker('getDate')).unix();
        var daysRemaining = Math.floor((b - a) / 60 / 60 / 24);
        if (daysRemaining < 0) {
            $('input[type="submit"]').prop("disabled", true);;
            isTo.validationEngine('showPrompt', '* Invalid range');
        } else {
            isTo.validationEngine('hidePrompt');
            $('input[type="submit"]').removeAttr("disabled");
        }
    }
}

/*
 * creates a datepickers for various types based on slot
 *
 * @param {integer} slot is the slot/index of the datepicker created
 */
function newDatePicker(slot) {
    var currentDate = new Date();
    $('.dateInventory ~ span, .time ~ span,.reportdate ~ span,.date ~ span,.timeTimeFrame ~ span,.timeframe ~ span').not('hasDatePicker').each(function () {
        $(this).click(function () {
            dateInput = $(this).siblings('.dateInventory,.time,.reportdate,.date,.timeTimeFrame,.timeframe');
            if (dateInput.attr('disabled') != 'disabled')
                dateInput.datepicker('show');
        });
    })

    //Set the VALUE property and attribute of inputs with datepickers when the datepicker is used
    $('.dateInventory,.time,.reportdate,.date,.timeTimeFrame,.timeframe').not('hasDatePicker').each(function () {
        var dateFormat = this.getAttribute('data-date-format');

        //if (dateFormat != null)
        //  dateFormat = dateFormat.replace('Do', 'D');

        var timeFormat = this.getAttribute('data-time-format');
        var dateTimeFormat = '';
        if (dateFormat && timeFormat)
            dateTimeFormat = dateFormat + " " + timeFormat;
        else if (dateFormat && !timeFormat)
            dateTimeFormat = dateFormat;
        else if (!dateFormat && !timeFormat)
            dateTimeFormat = timeFormat;

        $(this).change(function () {
            var newDate = moment(this.value, dateFormat + ' ' + timeFormat);
            if (newDate.isValid()) {
                this.value = newDate.format(dateTimeFormat);
                this.setAttribute('value', newDate.format(dateTimeFormat));
            }
        });
    })
    // var validator =  formval.validationEngine();
    //this makes the class cdrScheduleCalendar2 into a datetimepicker with several
    //special necessities
    $('.cdrScheduleCalendar2').each(function () {
        $(this).datetimepicker({
            showHour: true,
            showMinute: true,
            //maxDate: currentDate,
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            timeFormat: convertDateFormat(this.getAttribute('data-time-format'), datepickerConvertionFormats),
            onSelect: function (selectedDate) {
                var newDate = moment(this.value, this.getAttribute('data-date-format'), false);
                if (newDate.isValid()) {
                    newDate = newDate.format(this.getAttribute('data-date-format'));
                    this.value = newDate;
                    this.setAttribute('value', newDate);
                }
            },

            onClose: function () {
                $("[id=" + this.id + "-hidden]").val( moment(this.value, this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            }
        });
    }) //end of cdrScheduleCalendar2

    $('.date').not('hasDatePicker, .cdrScheduleCalendar2').each(function () {
        let allowFutureDate = $(this).hasClass('allowFutureDate');
        $(this).datepicker({
            maxDate: allowFutureDate ? undefined : currentDate,
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function (selectedDate) {
                var newDate = moment(this.value, this.getAttribute('data-date-format'), false);
                if (newDate.isValid()) {
                    newDate = newDate.format(this.getAttribute('data-date-format'));
                    this.value = newDate;
                    this.setAttribute('value', newDate);
                }

                $("[id=" + this.id + "-hidden]").val( moment(this.value, this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));

                var settings = $(this).data("datepicker").settings,
                    date = $.datepicker.parseDate(
                        settings.dateFormat || $.datepicker._defaults.dateFormat,
                        selectedDate, settings);

                log("date select is " + date + "for box " + this.id);
                if (this.id == 'from-' + slot) {
                    if (typeof $('#to-' + slot)[0] !== 'undefined') {
                        var curTo = new Date(moment($('#to-' + slot)[0].value, $('#to-' + slot)[0].getAttribute('data-date-format'), false));
                        log("curTo-" + curTo);
                    }

                    var newEnd = date;
                    //newEnd.setDate(newEnd.getDate()+31);
                    //log("newEnd-" + newEnd);
                    //$('#to-' + slot).datepicker("option", "maxDate", newEnd);
                    //$('#to-' + slot).datepicker("option", "minDate", null);
                } else {
                    log("$('#from-' + slot).attr(value)-" + $('#from-' + slot).val());
                    var start = $('#from-' + slot).datepicker("option", "getDate");
                    log("start-" + start);
                    log("date-" + date);
                    if (start > date) {

                        start.setDate(start.getDate() - 3);
                        var newEnd = start;
                        newEnd.setDate(newEnd.getDate() + 31);
                        $('#to-' + slot).datepicker("option", "maxDate", newEnd);
                        $('#to-' + slot).datepicker("option", "minDate", null);

                    }
                    //if ()
                    //$('#from-' + slot).datepicker("option", "maxDate", date);
                }

                // log( $('#from-' + slot).datepicker("option"));
                // log( $('#to-' + slot).datepicker("option"));

                // log($('#from-' + slot).val());
                // log($('#to-' + slot).val());
                //  log(settings);
                var a = Date.parse($("[id=from-" + slot + "-hidden]").val());
                var b = Date.parse($("[id=to-" + slot + "-hidden]").val());
                var difference = b - Math.round(a / 1000.0) * 1000;
                var daysRemaining = Math.floor(difference / 1000 / 60 / 60 / 24) + 1;


                //   $('#to-' + slot).valid();


                if (daysRemaining < 0) {
                    $('.filtersavebutton').prop("disabled", true);;
                    $('#to-0').validationEngine('showPrompt', '* Invalid range');
                } else if (daysRemaining > max_days) {
                    $('.filtersavebutton').prop("disabled", true);;
                    $('#to-0').validationEngine('showPrompt', '* Max range is ' + max_days + ' days');
                } else {
                    $('#to-0').validationEngine('hidePrompt');
                    $('.filtersavebutton').removeAttr("disabled");
                }


                // log ($('#from-' + slot));
                if ($('#from-' + slot).hasClass("ccmanagertables")) {
                    //  log ($('#from-' + slot));
                    //getStatsLayout(activeManagerTable);
                }

                if ($('#modal-from-' + slot).hasClass("ccmanagertablesModal")) {

                    getNewTableData();
                }
            },
            onClose: function () {
                var hiddenElement = $("[id=" + this.id + "-hidden]");
                var tempFormat = 'MM/DD/YYYY';
                if (hiddenElement.attr('hidden-field-format-override') !== undefined && hiddenElement.attr('hidden-field-format-override') !== '') {
                    tempFormat = hiddenElement.attr('hidden-field-format-override');
                }

                $("[id=" + this.id + "-hidden]").val( $(this).val() !== '' ? moment(this.value, this.getAttribute('data-date-format'), false).format(tempFormat) : '');
            }
        });
    }); //END OF THE IF

    $('.reportdate').not('hasDatePicker').each(function () {
        var from = '#modal-from-' + slot;
        var to = '#modal-to-' + slot;
        $(this).datepicker({
            maxDate: currentDate,
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function (selectedDate) {
                var newDate = moment(this.value, this.getAttribute('data-date-format'), false);
                if (newDate.isValid()) {
                    newDate = newDate.format(this.getAttribute('data-date-format'));
                    this.value = newDate;
                    this.setAttribute('value', newDate);
                }
                this.setAttribute('data-raw-date', moment(this.value, this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
                log("date select is " + selectedDate + " for box " + this.id);

                var thisDate = new Date(moment(this.value, this.getAttribute('data-date-format'), false));
                var fromDate = new Date(moment($(from).val(), $(from).attr('data-date-format'), false));
                var toDate = new Date(moment($(to).val(), $(to).attr('data-date-format'), false));

                //convert date objects to milliseconds for comparisons
                var msFromDate = fromDate.getTime();
                var msToDate = toDate.getTime();

                log("fromDate-" + fromDate);
                log("toDate-" + toDate);
                // log(msFromDate);
                // log(msToDate);
                if (msFromDate > msToDate) {
                    log('from date is greater than to date!');

                    if (this.id == 'from-' + slot || this.id == 'modal-from-' + slot) {
                        $(to).val(moment(fromDate).format($(to).attr('data-date-format')));
                        $(to).val( moment(fromDate).format($(to).attr('data-date-format')))
                        $(to).attr('data-raw-date', moment(fromDate).format('MM/DD/YYYY'));
                    } else {
                        $(from).val(moment(toDate).format($(from).attr('data-date-format')));
                        $(from).val( moment(toDate).format($(from).attr('data-date-format')));
                        $(from).attr('data-raw-date', moment(toDate).format('MM/DD/YYYY'));
                    }
                }

                var a = Date.parse($("[id=modal-from-0]").attr('data-raw-date')+" "+$("[id=modal-from-time]").val());
                var b = Date.parse($("[id=modal-to-0]").attr('data-raw-date')+" "+$("[id=modal-to-time]").val());
                var difference = b - Math.round(a / 1000.0) * 1000;
                var daysRemaining = Math.floor(difference / 1000 / 60 / 60 / 24) + 1;


                if (daysRemaining < 0) {
                    $("#"+this.id ).validationEngine('showPrompt', '* Invalid range');
                } else if (daysRemaining > max_days) {
                    $("#"+this.id ).validationEngine('showPrompt', '* Max range is ' + max_days + ' days');
                } else {
                    $(from).validationEngine('hidePrompt');
                    $(to).validationEngine('hidePrompt');
                    getNewTableData();
                }

            },
            onClose: function () {
                $(this).attr('data-raw-date', moment(this.value, this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            }

        });
    });

    function setBackEndDate(element) {
        $("[id=" + element.id + "-hidden]").val( moment($(element).val(), element.getAttribute('data-date-format') + " " + element.getAttribute('data-time-format'), false).format('MM/DD/YYYY h:mm a'));
    }

    /** Timepicker Addon **/
    $('.time').not('hasDatePicker').each(function () {
        $(this).datetimepicker({
            maxDate: moment(currentDate).endOf('day').toDate(),
            showMinute: false,
            timeFormat: convertDateFormat(this.getAttribute('data-time-format'), datepickerConvertionFormats),
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function (dateText, timepicker) {
                //change minutes to either 00 or 59 to capture the whole day
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format') + " " + this.getAttribute('data-time-format'), false).format('MM/DD/YYYY HH:mm'));
                var newDate;
                if (timepicker.hour == 0 && this.id.startsWith("from")) {
                    newDate = timepicker.formattedDate + ' ' + timepicker.hour + ':' + '00';
                    $(this).datetimepicker('setDate', newDate);
                } else if (timepicker.hour == 23 && this.id.startsWith("to")) {
                    newDate = timepicker.formattedDate + ' ' + timepicker.hour + ':' + '59';
                    $(this).datetimepicker('setDate', newDate);
                }

                var a = Date.parse($('[id=from-' + slot + '-hidden]').val());
                var b = Date.parse($('[id=to-' + slot + '-hidden]').val());
                var difference = b - Math.round(a / 1000.0) * 1000;
                var daysRemaining = Math.floor(difference / 1000 / 60 / 60 / 24) + 1;

                if (daysRemaining > max_days) {
                    $('.filtersavebutton').prop("disabled", true);;
                    $('#to-0').validationEngine('showPrompt', '* Max range is ' + max_days + ' days');
                } else {
                    $('#to-0').validationEngine('hidePrompt');
                    $('.filtersavebutton').removeAttr("disabled");
                }
            }
        });
    });

    $('.dateInventory').not('hasDatePicker').each(function () {
        $(this).datepicker({
            //minDate: new Date(),
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            monthNames: [_("January"), _("February"), _("March"), _("April"), _("May"), _("June"), _("July"), _("August"), _("September"), _("October"), _("November"), _("December")],
            dayNamesMin: [_('Su'), _('Mo'), _('Tu'), _('We'), _('Th'), _('Fr'), _('Sa')],
            onSelect: function (selectedDate) {
                //change minutes to either 00 or 59 to capture the whole day
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format'), false).format('YYYY-MM-DD'));
                if ($('.dateInventory[disabled="disabled"]').length == 0)//check that both date fields are enabled before validating
                    validateDateRange(this.getAttribute('data-date-format'));
            }
        });
    });

    var startDateTextBox = $('#from-' + slot);
    var endDateTextBox = $('#to-' + slot);
    var hasMinutes = false;

    if ($('.timeTimeFrame').hasClass('hasMinutes'))
        var hasMinutes = true;

    $('#from-' + slot + '.timeTimeFrame.isFrom').not('hasDatePicker').each(function () { //it this type of datepicke
        $(this).datetimepicker({
            showMinute: hasMinutes,
            timeFormat: convertDateFormat(this.getAttribute('data-time-format'), datepickerConvertionFormats),
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function () {
                setBackEndDate(this);
            },
            onClose: function (dateText, inst) {
                var dFormat = startDateTextBox[0].getAttribute('data-date-format') + ' ' + startDateTextBox[0].getAttribute('data-time-format');
                var testStartDate = moment(startDateTextBox[0].value, dFormat, false);
                var testEndDate = moment(endDateTextBox[0].value, dFormat, false);
                if (endDateTextBox.val() != '') {
                    if (testStartDate > testEndDate)
                        endDateTextBox[0].value = testStartDate.format(dFormat);
                } else if (startDateTextBox.val() != '') {
                    endDateTextBox.val(testStartDate.format(dFormat));
                }
                setBackEndDate(this);
                setBackEndDate(endDateTextBox[0]);
            }
        });
    });

    $('#to-' + slot + '.timeTimeFrame.isTo').not('hasDatePicker').each(function () { //it this type of datepicke
        $(this).datetimepicker({
            showMinute: hasMinutes,
            timeFormat: convertDateFormat(this.getAttribute('data-time-format'), datepickerConvertionFormats),
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            hour: "23",
            minute: "59",
            onSelect: function () {
                setBackEndDate(this);
            },
            onClose: function (dateText, inst) {
                var dFormat = startDateTextBox[0].getAttribute('data-date-format') + ' ' + startDateTextBox[0].getAttribute('data-time-format');
                var testStartDate = moment(startDateTextBox[0].value, dFormat, false);
                var testEndDate = moment(endDateTextBox[0].value, dFormat, false);
                if (startDateTextBox.val() != '') {
                    if (testStartDate > testEndDate)
                        startDateTextBox[0].value = testEndDate.format(dFormat);
                } else if (endDateTextBox.val() != '') {
                    startDateTextBox.val(testEndDate.format(dFormat));
                }
                setBackEndDate(this);
                setBackEndDate(startDateTextBox[0]);
            }
        });
    });

    $('#from-' + slot + '.timeframe.isFrom').not('hasDatePicker').each(function () {  //it this type of datepicke
        $(this).datepicker({
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function () {
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            },
            onClose: function (dateText, inst) {
                dFormat = startDateTextBox[0].getAttribute('data-date-format');
                var testStartDate = moment(startDateTextBox[0].value, dFormat, false);
                var testEndDate = moment(endDateTextBox[0].value, dFormat, false);
                if (endDateTextBox.val() != '') {
                    if (testStartDate > testEndDate)
                        endDateTextBox[0].value = testStartDate.format(dFormat);
                } else if (startDateTextBox.val() != '') {
                    endDateTextBox.val(testStartDate.format(dFormat));
                }
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
                $("[id=" + endDateTextBox[0].id + "-hidden]").val( moment($(endDateTextBox[0]).val(), endDateTextBox[0].getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            }
        });
    });

    $('#to-' + slot + '.timeframe.isTo').not('hasDatePicker').each(function () {  //it this type of datepicke
        $(this).datepicker({
            dateFormat: convertDateFormat(this.getAttribute('data-date-format'), datepickerConvertionFormats),
            onSelect: function () {
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            },
            onClose: function (dateText, inst) {
                dFormat = startDateTextBox[0].getAttribute('data-date-format');
                var testStartDate = moment(startDateTextBox[0].value, dFormat, false);
                var testEndDate = moment(endDateTextBox[0].value, dFormat, false);
                if (startDateTextBox.val() != '') {
                    if (testStartDate > testEndDate)
                        startDateTextBox[0].value = testEndDate.format(dFormat);
                } else if (endDateTextBox.val() != '') {
                    startDateTextBox.val(testEndDate.format(dFormat));
                }
                $("[id=" + this.id + "-hidden]").val( moment($(this).val(), this.getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
                $("[id=" + startDateTextBox[0].id + "-hidden]").val( moment($(startDateTextBox[0]).val(), startDateTextBox[0].getAttribute('data-date-format'), false).format('MM/DD/YYYY'));
            }
        });
    });

}

/**
 * function to change audio source. used with #greeting-select in user voicemail page
 *
 **/
function changeAudioSource(path) {
    var audio = $('#audio-player-0');

    src = $('#audio-player-0');
    if ($('#audio-player-0-aac-1').length)
        $('#audio-player-0-aac-1').attr("src", path + "&convert=aac");
    if ($('#audio-player-0-aac-2').length)
        $('#audio-player-0-aac-2').attr("src", path + "&convert=aac");
    if ($('#audio-player-0-aac-3').length)
        $('#audio-player-0-aac-3').attr("src", path + "&convert=signed");
    if ($('#audio-player-0-wav-1').length)
        $('#audio-player-0-wav-1').attr("src", path + "&convert=signed");
    if ($('#audio-player-0-wav-2').length)
        $('#audio-player-0-wav-2').attr("src", path + "&convert=ogg");
    if ($('#audio-player-0-wav-3').length)
        $('#audio-player-0-wav-3').attr("src", path + "&convert=aac");
    //alert($('#audio-player-0-wav-1').attr("src"));

    //audio.attr('src', path);
    audio[0].load();
}

/**
 * function changes the download source for the associated download button. used in user voicemail page
 *
 **/
function changeDownloadSource(path) {
    var download = $('#audio-player-0').siblings('.download-audio');
    var newPath = path + '&convert=signed';

    download.attr('href', newPath);
}

/**
 * download a file from a given path
 * this is being activated from pressing the export button
 **/
function initDownloadFile() {
    $('.download-file').on('click', function () {
        var path = $(this).data('download-path');

        window.location = path;

        if ($(this).data('download-disable') == true)
            $(this).prop("disabled", true);
    });
}

/**
 * Show list of scheduled exports
 * (does nothing for now)
 * need to add it up top as well.
 **/
function showScheduledExports() {
    $('.show_scheduled').on('click', function () {
        return;
        var path = $(this).data('download-path');

        window.location = path;

        if ($(this).data('download-disable') == true)
            $(this).prop("disabled", true);
    });
}

//makes confirmation password field required if the new-password field is non-empty.
function newPassValidate() {
    $('#confirm-new-password').removeClass('validate[equals[new-password]]');
    $('#confirm-new-password').removeClass('validate[required,equals[new-password]]');
    $('#confirm-new-password').validationEngine('hidePrompt');
    if ($('#new-password').val() != "") {
        $('#confirm-new-password').addClass('validate[required,equals[new-password]]');
    } else {
        $('#confirm-new-password').addClass('validate[equals[new-password]]');
    }
}

function initFlashMessage(wait, fade) {
    $("#flashMessage").delay(wait).fadeTo(fade, 0.00, function () {
        $(this).remove();
    });
}

function jsFlash(data, theClass, duration, callback) {

    var message = $('<div><div class="flashMessage new alert-dismissible alert alert-' + theClass + '">' + data + '</div></div>');
    var count = $('.flashMessage').length;
    var timer;
    var displayDuration = typeof duration == 'number' ? duration : 6000;

    if (arguments.length > 0) {
        $('#flashContainer').prepend(message);

        $('.fixed-container').css('visibility', 'visible');

        $('.flashMessage').css({width: 'auto'});

        message.hide().animate({
            height: "show",
            opacity: "show"
        }, 200, function () {
            $('.fixed-container').css('visibility', 'hidden');
        });

        if (count > 2)
            $('.flashMessage:last').fadeOut(100, function () {
                $(this).remove();
                $(this).parent().remove();
            });
    }

    timer = setTimeout(function () {
        message.fadeOut(500, function () {
            $(this).remove();
        });
    }, displayDuration); // You can modify this to display the message for different times

    // Make the messages container clickable to hide the message before the timeout fires
    message.click(function () {
        //clearTimeout(timer);
        $(this).fadeOut(500, function () {
            $(this).remove();
        });
    });

    if (typeof callback === 'function')
        callback();
    else
        $('.flashMessage').removeClass('new');
}

function jsFlashDismissible(data, theClass, callback) {
    if (theClass == 'warning') {
        var message = $('<div><div class="flashMessage new alert-dismissible alert alert-' + theClass + '">' +
            '<span class="message-content" style="font-weight: normal;">' + data + '</span>' +
            '  ' +
            '<a href="#" class="more-info-link" style="text-decoration: underline; color: #c09853 !important; font-weight: normal !important;">' + _('View Errors') + '</a>' +
            '<button type="button" style="margin-right: 20px; margin-left: -10px;" class="close" data-dismiss="alert" aria-label="Close">&times;</button>' +
            '</div></div>');
    } else {
        var message = $('<div><div class="flashMessage new alert-dismissible alert alert-' + theClass + '">' +
            '<span class="message-content" style="font-weight: normal;">' + data + '</span>' +
            '<button type="button" style="margin-right: 20px; margin-left: -10px;" class="close" data-dismiss="alert" aria-label="Close">&times;</button>' +
            '</div></div>');
    }
    var count = $('.flashMessage').length;

    if (arguments.length > 0) {
        $('#flashContainer').prepend(message);

        $('.fixed-container').css('visibility', 'visible');

        $('.flashMessage').css({ width: 'auto' });

        message.hide().animate({
            height: "show",
            opacity: "show"
        }, 200, function () {
            $('.fixed-container').css('visibility', 'hidden');
        });

        if (count > 2) {
            $('.flashMessage:last').fadeOut(100, function () {
                $(this).remove();
                $(this).parent().remove();
            });
        }
    }

    // Make the close button clickable to hide the message
    message.find('.close').click(function () {
        $(this).closest('.flashMessage').fadeOut(500, function () {
            $(this).remove();
        });
    });

    // Add click event for the "More Info" link
    message.find('.more-info-link').click(function(e) {
        e.preventDefault();
        // hide the alert
        $(this).closest('.flashMessage').fadeOut(500, function () {
            $(this).remove();
        });

        $('#moreInfoModal').modal('show');
    });

    if (typeof callback === 'function') {
        callback();
    }
    else {
        $('.flashMessage').removeClass('new');
    }
}

function postValue(url, value, success, error) {
    var currentElement = document.activeElement;
    var messageElement = document.getElementById("message");
    if (messageElement) messageElement.blur();

    var originalShownValue = $(".contacts-message2-text").text();
    if (value != "") {
      let string = decodeURIComponent(value).replace(/COLLON/g,":");
      messageElement.value = string;
      $(".contacts-message2-text").text(string);
      $('.contacts-message2-text').css({'color':'#a2a2a2'});
    } else {
      messageElement.value = '';
      $(".contacts-message2-text").text("Set a status message");
      $('.contacts-message2-text').css({'color':'#08c'});
    }
    $.post(url + "/" + value, function () {
    })
        .fail(function () {
            //switch back to original value if error occured
            $(".contacts-message2-text").text(originalShownValue);
            if (error != null) jsFlash(error, "danger");
        })
        .done(function () {
            if (success != null) jsFlash(success, "success");
        });

}

function onBlurStatus(event, value) {
  document.getElementById("contacts-message").style.display = "none";
  document.getElementById("contacts-message2").style.display = "block";
}

function traceBack(target, hide)
{
    var to_hide = document.querySelectorAll(hide);
    $(target).hide();
    $(target).html('');
    for (i = 0; i < to_hide.length; ++i) {
        to_hide[i].style.display = 'block';
    }
}

function exportTrace(url) {
    url = url + '/csv';
    window.location = url;
    return;
}

function saveTrace(url) {
    jsFlash(_('Generating share link…'));
    url = url + '/1';
    try{
        navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Promise(async (resolve) => {
                    $.getJSON(url, function (data) {
                        var key = "";
                        if (data !== null)
                            key = data['key'];
                        console.log(key);
                        resolve(new Blob([key], {type: 'text/plain'}));
                    });
                }),
            }),
        ]).then(function(){
            jsFlash(_('Copied to clipboard'), 'success');
        }, function (err) {
            throw 'Error copying to clipboard';
        });
    }
    catch (err) {
        $.getJSON(url, function (data) {
            if (data == null) {
                jsFlash(_('Error'));
                return;
            }
            const el = document.createElement('textarea');
            el.value = data['key'];
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            jsFlash(_('Copied to clipboard'), 'success');
        });
    }
}

function getTrace(url, element) {
    $('#recording-alert').hide();
    if (element) {
        var target = $(element).data("target");
        var to_hide = document.querySelectorAll($(element).data("hide"));
        for (i = 0; i < to_hide.length; ++i) {
            to_hide[i].style.display = 'none';
        }
        $(target).show();
        var actions = '<button class="btn" style="margin-bottom:10px" id="trace-back-btn" onclick="traceBack(\''+target+'\',\''+$(element).data("hide")+'\')"><i class="nsicon nsicon-reply"> </i> '+_("Back")+' </button>';
        actions += '<div class="action-container-right">';
        actions += '<button class="btn" style="margin-bottom:10px" id="trace-share-btn" onclick="saveTrace(\''+url+'\')">'+_("Share")+' </button>';
        actions += '<button class="btn" style="margin-bottom:10px" id="trace-export-btn" data-download-path=\''+url+'\' onclick="exportTrace(\''+url+'\')" download>'+_("Export")+' </button>';
        actions += '</div>';
        actions += '<div class="loading-container" style="position: initial;margin-top: 60px"><div class="loading-spinner la-ball-spin-clockwise"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
        $(target).append(actions);
        $.getJSON(url, function (data) {
            $(target).find('.loading-container').remove();
            if (data == null) {
                var notrace = '<div class="nonecreated"><h3>' + _('No trace available') + '</h3></div>';
                $(target).append(notrace);
            }
            else if (typeof data.svg != 'undefined') {
                var svg = atob(data.svg);
                var elm = document.querySelector(target);
                elm.innerHTML += '<div class="flow-fullscreen-container">' + svg + '</div>';
                Array.from(elm.querySelectorAll("script")).forEach( script_tag => {
                  const new_script_tag = document.createElement("script");
                  Array.from(script_tag.attributes)
                    .forEach( attr =>
                      {
                        if (attr.name.includes("xml"))
                          return;
                        if (attr.name == "xlink:href")
                          new_script_tag.src = attr.value;
                        new_script_tag.setAttribute(attr.name, attr.value);
                      });
                  if (script_tag.textContent) {
                        new_script_tag.textContent = script_tag.textContent;
                  } else if (script_tag.innerText) {
                        new_script_tag.innerText = script_tag.innerText;
                  }
                  script_tag.parentNode.replaceChild(new_script_tag, script_tag);
                });
            }
        });
        return false;
    }
    $.getJSON(url, function (data) {
        log(data);

        if (data == null) {
            var modalObj = $('#history-trace');

            modalObj.css("minHeight", modalObj.height());
            //modalObj.empty();
            try {
                modalObj.html('<div class="modal-header"><button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#history-trace\');">&times;</button><h4>' + _('Call Trace') + '</h4></div><div class="modal-body"><div class="nonecreated"><h3>' + _('No trace available') + '</h3></div></div><div class="modal-footer"><button class="btn cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#history-trace\');">' + _('Close') + '</button></div>');
            } catch (err) {
            }

            modalObj.find('.modal-body').css("minHeight", "90px");
            modalObj.find('.modal-header, .modal-footer').fadeIn(25, function () {
                modalObj.find('.modal-body')
                    .animate({
                        height: "show", opacity: "show"
                    }, {
                        duration: 250,
                        progress: function () {
                            modalResize(modalObj);
                        }
                    });
            });


        } else if (typeof data.url != 'undefined')
            loadModal('#history-trace', data.url);
        else {
            var modalObj = $('#history-trace');

            modalObj.css("minHeight", modalObj.height());
            var html = '<div class="modal-header"><button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#history-trace\');">&times;</button><h4>' + _('Call Trace') + '</h4></div><div class="modal-body">';
            // 	html += '<div class="nonecreated"><h3>No trace available</h3></div>';

            html += ' 	<ul id="serverTabs" class="nav nav-tabs">';
            var x = ' class="active" ';
            for (var key in data) {
                html += ' 	  <li ' + x + '><a href="#' + key.replace(/\W/g, '') + '" data-rawurl="' + data[key].replace("/modal.php", "") + '" data-toggle="tab">' + key + '</a></li>';
                x = '';
            }


            html += '  	</ul>';
            html += ' <div class="tab-content">';
            x = ' active';
            for (var key in data) {
                html += ' <div class="tab-pane ' + x + '" id="' + key.replace(/\W/g, '') + '">';  //+data[key];
                x = '';
                html += '<img src="' + data[key].replace("modal.php", "callflow.svg") + '" id="' + key.replace(/\W/g, '') + 'img" >';

                html += '</div>';
                //  propigateTabTrace(key.replace(/\W/g, ''),data[key]);
            }
            html += ' 	</div>';
            html += '</div><div class="modal-footer">';

            x = ' active';
            for (var key in data) {
                if (x == " active") {
                    html += '	 <a id="dnlLink" class="btn" href="' + data[key].replace("/modal.php", "") + '.csv" target="_blank">' + _('Download CSV') + '</a> ';
                    html += '	 <a id="viewLink" class="btn" href="' + data[key].replace("/modal.php", "") + '/index_with_frames.html" target="_blank">' + _('View Full Trace') + '</a> ';
                }
                x = '';
            }
            html += ' <button class="btn cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'#history-trace\');">' + _('Close') + '</button></div>'


            html += "<script> $('#serverTabs a').click(function (e) {  e.preventDefault(); $(this).tab('show'); " +
                "$('#dnlLink').attr('href', $(this).data('rawurl')+'.csv');$('#viewLink').attr('href', $(this).data('rawurl')+'/index_with_frames.html');}); ";
            for (var key in data) {
                html += ' $( "#' + key.replace(/\W/g, '') + 'img" ).load(function() { modalResize($("#history-trace")); }); ';
            }
            html += "</script>";
            modalObj.html(html);

            // 	 modalResize(modalObj).delay( 2000 );
            modalObj.find('.modal-body').css("minHeight", "90px");
            modalObj.find('.modal-header, .modal-footer').fadeIn(25, function () {
                modalObj.find('.modal-body')
                    .animate({
                        height: "show", opacity: "show"
                    }, {
                        duration: 250,
                        progress: function () {
                            modalResize(modalObj);
                        }
                    });
            });
        }

        //window.open(data.url);

    });

}


function getCradle(url, element) {
    if (element) {
        var target = $(element).data("target");
        var to_hide = document.querySelectorAll($(element).data("hide"));
        for (i = 0; i < to_hide.length; ++i) {
              to_hide[i].style.display = 'none';
        }
        $(target).addClass('loading fade in');
        if (document.querySelector(target).classList.contains('modal'))
        {
            $(target).modal('show');
            $(target).animate({
                height: 'show',
                opacity: 1,
            }, {
                progress: function () {
                    modalResize($(target));
                },
                complete: function () {
                    modalResize($(target));
                }
            });
        }
        else {
            $(target).modal('show');
            var actions = '<button class="btn" style="margin-bottom:10px" id="trace-back-btn" onclick="traceBack(\''+target+'\',\''+$(element).data("hide")+'\')"><i class="nsicon nsicon-reply"> </i> '+_("Back")+' </button>';
            actions += '<div class="loading-container" style="position: initial;margin-top: 60px"><div class="loading-spinner la-ball-spin-clockwise"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
            $(target).append(actions);
        }

        $.getJSON(url, function (data) {
            $(target).find('.loading-container').remove();
            $(target).removeClass('loading');
            if (document.querySelector(target).classList.contains('modal')) {
                console.debug(url);
                const traceClass = (sub_scope=="Super User" || sub_scope=="Reseller")?"":"hide";
                $(target).html('<div class="modal-header"><button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\''+target+'\');">&times;</button><h4>' + PORTAL_CRADLE_TO_GRAVE_FEATURE_NAME + '</h4></div><div class="modal-body"></div><div class="modal-footer"><button class="btn '+ traceClass +'" data-target="#trace-inline" data-hide=".action-container-row, .callhistory-panel-main, .cc-details-table" onclick="hideModal(\''+target+'\');$(\'div.cc-details-table\').hide();getTrace(\''+url.replace('cradle','trace')+'\',this);debugger;return false;">'+ _('View SIP Flow') + '</button><button class="btn cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\''+target+'\');">' + _('Close') + '</button></div>');
                $(target).find('.modal-header, .modal-body, .modal-footer').show();
                target += " > .modal-body";
                console.log(target);
            }
            if (data == null || data.length == 0) {
                var notrace = '<div class="nonecreated"><h3>' + _('No trace available') + '</h3></div>';
                $(target).append(notrace);
            }
            ul = $('<ul class="cradle-timeline">');
            data.forEach(function(e) {
                var e_class = e.hasOwnProperty('classes') ? 'event ' + e['classes'] : 'event';
                var li = $('<li class="'+e_class+'" data-date="'+e['ts']+'">');
                if (e['diff_ts'].length > 0)
                    li.append('<span class="event-ts">+'+e['diff_ts']+'</span>');
                li.append('<p>'+e['str']+'</p>');
                ul.append(li);
            });

            $(target).append(ul);
            if (document.querySelector(target).classList.contains('modal') || $(target).parent('.modal').length > 0) {
                modalResize($(target).parent('.modal'));
            }
        });
        return false;
    }
}

function propigateTabTrace(mdlName, url) {
    //alert(url.replace("modal.php","callflow.svg"));
    $.ajax({
        url: url,
        cache: false
    }).done(function (html) {
        //alert(mdlName);
        var modalObj = $('#' + mdlName);
        //alert(modalObj);
        try {
            //alert('loading modal data succeeded for ' + modalId);
            //log(html);


            //alert(html);
            modalObj.css("minHeight", "600px");
            modalObj.empty();


            modalObj.append(html);
        } catch (err) {
            alert("error caught - " + err);
            // log(html);
        }

        return;

        if (modalId == "#history-trace") {
            log('trying to animate modal width to window');
            var srcImage = $('.callflow-image img');

            modalObj.css("maxHeight", $(window).height() - 30);

            var widthImage = new Image();
            widthImage.onload = function () {
                var imageWidth = widthImage.width;
                modalObj.find('.modal-header, .modal-footer').fadeIn(25, function () {

                    if (imageWidth > 610) {
                        if (imageWidth > ($(window).width() - 20))
                            imageWidth = $(window).width() - 20;
                        modalObj.animate({
                            width: imageWidth
                        }, {
                            duration: 150,
                            queue: false,
                            progress: function () {
                                modalResize(modalObj, true);
                            },
                            complete: function () {
                                modalObj.trigger('modal.animation.end');
                            }
                        });
                    }
                    modalObj.find('.modal-body')
                        .animate({
                            height: "show", opacity: "show"
                        }, {
                            duration: 100,
                            queue: false,
                            progress: function () {
                                if (imageWidth < 610)
                                    modalResize(modalObj, true);
                            },
                            complete: function () {
                                if (imageWidth < 610)
                                    modalResize(modalObj, true);
                                modalObj.trigger('modal.animation.end');
                            }
                        });
                });
            };
            widthImage.src = srcImage.attr("src");
        } else {
            modalObj.find('.modal-header, .modal-footer').fadeIn(25);
            modalObj.find('.modal-body')
                .animate({
                    height: "show", opacity: "show"
                }, {
                    duration: 100,
                    progress: function () {
                        modalResize(modalObj);
                    },
                    complete: function () {
                        modalResize(modalObj);
                        modalObj.trigger('modal.animation.end');
                    }
                });

        }

        //workaround to prevent modal hide event from triggering tooltip
        $('.modal').unbind('hide');
    }).fail(function (textStatus) {
        modalObj.removeClass('loading').addClass('load-failed');
        var html = '<div class="modal-header">'
            + '<button type="button" class="close cancel" data-dismiss="modal" aria-hidden="true" onclick="hideModal(\'' + modalId + '\');">&times;</button>'
            + '<h4>' + textStatus.statusText + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<div class="load-failed">'
            + '<h4>The modal contents failed to load.</h4><h4>Please try again.</h4>'
            + '</div>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="btn" class="cancel btn" data-dismiss="modal" onclick="hideModal(\'' + modalId + '\');">Close</button>'
            + '</div>'
        modalObj.html(html);
        modalObj.find('.modal-header, .modal-body, .modal-footer').show();
        modalResize(modalObj);
    });

}

function clickToDial(user, formatted, destination, origination, autoanswer) {
    if (typeof origination != 'undefined' && origination != null)
        origination = "/" + origination;
    else
        origination = "";

    if (typeof autoanswer === 'undefined' || autoanswer === null)
        autoanswer = false;

    formatted = cleanDevice(formatted);

    destination = destination.replace("+", "PLUS");
    if (autoanswer)
        $.post("/portal/calls/clickToDialAA/" + user + "/" + destination + origination, function (data) {

            if (data.trim() == "ok")
                jsFlash(_("Please answer your ringing phone and the call will be connected to {0}", formatted), 'success');
            else
                jsFlash(_("There was an error placing your call to {0}", formatted), "danger");

        });
    else
        $.post("/portal/calls/clickToDial/" + user + "/" + destination + origination, function (data) {

            if (data.trim() == "ok")
                jsFlash(_("Please answer your ringing phone and the call will be connected to {0}", formatted), 'success');
            else
                jsFlash(_("There was an error placing your call to {0}", formatted), "danger");

        });
}

function clickToAddParticipant(bridge, destination) {
    $.post("/portal/conferences/clickToDial/" + bridge + "/" + destination, function (data) {

        if (data.trim() == "ok")
            jsFlash(_("A call to {0} has been initiated", destination), 'success');
        else
            jsFlash(_("There was an error placing the call to {0}", destination), "danger");

    });

}

//itm is the mute button that was pressed
function muteParticipant(bridge, destination, itm) {
    $.post("/portal/conferences/mute/" + bridge + "/" + destination, function (data) {
        log(data);
        if (data.trim() == "ok") {
            jsFlash("Participant muted!", 'success');

            itm.removeClass('mute')
                .addClass('listen')
                .attr('data-original-title', 'Un-mute')
                .attr('onclick', 'unmute($(this))');
            itm.parent().siblings(".participant-mode").html('<span class="label label-success">Active</span>')
            $('.helpsy').tooltip('hide');
            initTooltips();
        } else {
            jsFlash("Participant could not be muted!", "danger");
        }

    });

}

function unmuteParticipant(bridge, destination, itm) {
    $.post("/portal/conferences/unmute/" + bridge + "/" + destination, function (data) {
        log(data);
        if (data.trim() == "ok") {
            jsFlash("Participant un-muted!", 'success');

            itm.removeClass('listen')
                .addClass('mute')
                .attr('data-original-title', _('Mute'))
                .attr('onclick', 'mute($(this))');
            itm.parent().siblings(".participant-mode").html('<span class="label label-important">' + _('Muted') + '</span>')
            $('.helpsy').tooltip('hide');
            initTooltips();
        } else
            jsFlash("Participant could not be un-muted!", "danger");

    });

}

function discParticipant(bridge, destination) {
    $.post("/portal/conferences/disc/" + bridge + "/" + destination, function (data) {
        log(data);

        $('.helpsy').tooltip('hide');

        if (data.trim() == "ok")
            jsFlash("Participant disconnected!", 'success');
        else
            jsFlash("Participant not disconnected!", "danger");

    });

}

// gets the messages count of voicemails and sms/chat (if enabled)
function getCount() {
    $.get('/portal/voicemails/count/0', function (data) {
        var vmMsg = data;

        if (enableChatUC || enableChatSMS) {
            //get unread sms/chat messages if enabled
            var args = {
                'action': "count",
                "object": "messagesession",
                "format": "json",
                "user": sub_user,
                "domain": sub_domain,
                "last_sender": "remote",
                "last_status": "unread",
                "muted": "no"
            };
            netsapiens.api.post(args).then(function (data) {
                if (typeof data == "string")
                    data = JSON.parse(data);

                var chatMsg = 0;
                var totalMsg;

                if (data && typeof data.total != 'undefined' && $.isNumeric(data.total))
                    chatMsg = data.total;
                else if (data && typeof data == 'number')
                    chatMsg = data;

                //update tab badges if they exist
                if ($("#sub-nav-msg-count").length) {
                    handleMsgCountChatSMS(chatMsg);
                    handleMsgCountChatVM(vmMsg);
                }
                //else just update the main messages badges
                else {
                    totalMsg = chatMsg + parseInt(vmMsg);
                    handleMsgCount(totalMsg);
                }
            });
        } else {
            //just use voicemail count
            handleMsgCount(vmMsg);
        }

    });
}

// gets the messages count of voicemails and sms/chat (if enabled)
function getRecentCount() {
    $.get('/portal/messages/countUnreadRecents/', function (data) {
        var chatMsg = 0;
        if (enableChatUC || enableChatSMS) {
            if (data && typeof data != 'undefined' && $.isNumeric(data)) {
                chatMsg = data;
            }
            handleRecentSessionCount(chatMsg);
        }
    });
}


// updates messages count badge
function handleMsgCount(count) {
    var $badge;

    if ($('#nav-msg-count').length) {
        $badge = $('#nav-msg-count');
    }
    else if ($('.dropdown-msg-count').length) {
        $badge = $('.dropdown-msg-count');
    }
    else {
        return;
    }

    if (count > 0) {
        $badge.text(count).fadeIn();
    }
    else {
        $badge.fadeOut();
    }
}

// updates tabs chat/sms count badge
function handleMsgCountChatSMS(count) {
    // debugger;
    if (count > 0)
        $('#sub-nav-msg-count').text(count).fadeIn();
    else
        $('#sub-nav-msg-count').fadeOut();
}

// updates tabs voicemail count badge
function handleMsgCountChatVM(count) {
    if (count > 0)
        $('#sub-nav-vm-count').text(count).fadeIn();
    else
        $('#sub-nav-vm-count').fadeOut();
}


// updates tabs voicemail count badge
function handleRecentSessionCount(count) {
    var $recentUnreadBadge;

    if ($('#recents-msg-count').length) {
        $recentUnreadBadge = $('#recents-msg-count');

        if (count > 0) {
            $recentUnreadBadge.text(count).fadeIn();
        }
        else {
            $recentUnreadBadge.fadeOut();
        }
    }
}


function minusOneVmail() {
    var count = $('#nav-msg-count').text();
    count = count - 1;
    handleMsgCount(count);
}

/**
 * Reseller was chosen, so should change the list of the domains and users that are available for autofill
 *
 */
function cdrScheduleChangeReseller() {
    clearAutoComplete('domain');
}

/**
 * Domain was chosen, so should change the list of the users that are available for autofill
 *
 */
function cdrScheduleChangeDomain() {
    //$('#app-details').hide();
    $('#user-choices').val( '');

    clearAutoComplete('user-choices');
}

/**
 * Reseller was chosen, so should change the list of the domains that are available for autofill
 *
 */
function cdrScheduleChangeReseller() {
    //$('#app-details').hide();
    $('#domain-choices').val( '');
    $('#user-choices').val( '');

    clearAutoComplete('domain-choices');
    clearAutoComplete('user-choices');
}

function inventoryChangeDomain() {
    //$('#app-details').hide();
    if (notesClear)
        $('#notes').val( '');

    $('#PhonenumberApplication').val( 'available');
    $('#PhonenumberApplication').change();

    $('#trunk-choices-dd').data('domain', "");
    $('#route-choices-dd').data('domain', "");

    $('#user-choices').val( '');
    $('#fax-choices').val( '');
    $('#conference-choices').val( '');
    $('#callqueue-choices').val( '');
    $('#vmail-choices').val( '');
    $('#PhonenumberNumber').val( '');
    clearAutoComplete('user-choices');
    clearAutoComplete('fax-choices');
    clearAutoComplete('conference-choices');
    clearAutoComplete('callqueue-choices');
    clearAutoComplete('vmail-choices');
    clearAutoComplete('attendant-choices');


}

function answerrulesFeatureCheck() {
    //minfeature
}

function updateExportHref() {
    var path = '/portal/contacts/export/' + encodeURIComponent($("#ContactContacts").val())
        + "/" + $("#ContactFormat").val() + "/contacts.";
    var format = $("#ContactFormat").val() + "";

    if (format == "vcard")
        path = path + "vcf";
    else
        path = path + "csv";

    $('#export_button').attr('href', path);

}

//update the path the export button will take to make sure it is in the
//export_shared_contacts function instead of looking at the regular export subset
function updateExportHrefShared() {
    var path = '/portal/contacts/export_shared_contacts/' + encodeURIComponent($("#ContactContacts").val())
        + "/" + $("#ContactFormat").val() + "/contacts.";
    var format = $("#ContactFormat").val() + "";

    if (format == "vcard")
        path = path + "vcf";
    else
        path = path + "csv";

    $('#export_button').attr('href', path);

}

function pad(num) {
    return ("0" + num).slice(-2);
}

function getSecDiff(date) {
    var startTime = new Date(Date.parse(date + " GMT"));
    //log("startTime "+startTime);

    if (typeof startTime == 'undefined' || startTime == "Invalid Date" || startTime == "NaN") {
        startTime = Date.parseExact(startTime, 'yyyy-MM-ddd hh:mm:ss zzz');
        //log("startTime "+startTime);
    }

    var currentTime = new Date();
    //log("current time "+currentTime);
    var startMili = startTime.getTime();
    var currentMili = currentTime.getTime();
    var sec = (currentMili - startMili) / 1000;
    sec = Math.floor(sec);
    //log("current sec "+sec);
    return sec;
}

function getDuration(date, offset) {
    var sec = getSecDiff(date);
    sec = sec - offset;
    if (sec < 0)
        sec = getSecDiff(date);
    return getMMss(sec);
}

function getMMss(sec) {
    var hour = Math.floor(sec / 3600);
    sec = sec - (hour * 3600);
    var min = Math.floor(sec / 60);
    sec = sec - (min * 60);
    sec = Math.floor(sec);
    var duration = "";

    if (hour > 0)
        duration += pad(hour) + ":";
    duration += pad(min) + ":";
    duration += pad(sec);
    return duration;
}

function changehidden(event, ui, avail, hidden) {
    if (typeof ui == 'undefined')
        return;
    var selectedObj = ui.item;
    var device = "";
    $("#" + avail + " option").map(function () {
        if (selectedObj.value == this.value || selectedObj.value == this.innerHTML)
            device = this.text;
    });
    $('#' + hidden).val( device);
    if (device === "" && selectedObj.value.includes("@conference-bridge")) {
        $('#' + hidden).val( selectedObj.value);
    }

}

function clearAutoComplete(id) {
    var choices = [];
    $('#' + id).autocomplete({
        //autoFocus: true,
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(choices, request.term);
            response(results);
        }
    });


}

function changeDispType() {
    var disp = $('#CallhistoryDisposition');
    var reason = $('#CallhistoryReason');
    var disp_value = disp.val().toString();
    reason.empty();
    var matchString = '#disposition-' + disp_value.replace(/ /g, '') + " > option";
    $(matchString).each(function () {
        reason.append("<option>" + this.value + "</option>");
    });
}

//returns a formatted NA number
function cleanDevice(str) {
    //log("cleaning device "+str);
    var found = false;
    $('.hiddenconflist').each(function () {
        //log($(this).attr('id'));
        if ($(this).attr('id') == str) {
            found = true;
            str = $(this).val();
            return $(this).val();
        }


    });
    if (found)
        return str;

    if (typeof str != "string")
        str = str + "";

    if (PORTAL_PHONENUMBER_REMOVE_POUND_PREFIXES) {
        str = str.replace("%23", "#");
        str = str.substring(str.indexOf("#") + 1);
    }


    if ("Call-To-Talk" == str)
        return _("Click to Call");
    str = cleanDevicePrep(str);


    if (str.includes("video.bridge"))
        str = _("Video Bridge");


    //log(str +" is not a number");
    if (/^\d+$/.test(str)) {
        //log(str +" is a number");

        return netsapiens.utils.formatPhoneNumber(str, PORTAL_LOCALIZATION_NUMBER_FORMAT);
    } else {
        //log(str +" is not a number");
    }
    //log("the length  is="+str.length);

    //log("the modded number is="+str);

    return str;

}

//strip all characters except numbers
function cleanDevicePrep(str) {
    if (typeof str == 'undefined' || str == null)
        return "";

    //make sure str is a string
    if (typeof str !== 'string')
        str = str.toString();

    str = str.replace("sip", "");
    str = str.replace(":", "");
    if (PORTAL_PHONENUMBER_REMOVE_PLUS_ON_CALL) {
        str = str.replace("+", "");
    }
    str = str.replace("(", "");
    str = str.replace(")", "");
    str = str.replace("-", "");
    str = str.replace(/\./g, "");
    str = str.replace(/:/g, "");
    str = str.replace(/ /g, "");
    if (PORTAL_PHONENUMBER_REMOVE_PLUS_ON_CALL) {
        str = str.replace(/\+/g, "");
    }
    str = str.replace(/\(/g, "");
    str = str.replace(/\)/g, "");
    str = str.replace(/-/g, "");
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.replace('wp', '');
    str = str.replace('\"', '');
    str = str.replace(']', '');
    str = str.replace('[', '');
    var group = str.split("@");
    str = group[0];
    str = str.replace("%40", "@");
    var group = str.split("@");
    str = group[0];

    return str;
}

function cleanRemote(str) {
    if (typeof str === 'undefined' || str === null)
        return "";

    str = str.replace("sip", "");
    str = str.replace(":", "");
    str = str.replace("+", "");
    str = str.replace("(", "");
    str = str.replace(")", "");
    str = str.replace("-", "");
    str = str.replace(/\./g, "");
    str = str.replace(/:/g, "");
    str = str.replace(/ /g, "");
    str = str.replace(/\+/g, "");
    str = str.replace(/\(/g, "");
    str = str.replace(/\)/g, "");
    str = str.replace(/-/g, "");
    str = str.replace(/^\s+|\s+$/g, '');

    str = str.replace(/\[/g, "");
    str = str.replace(/\]/g, "");
    str = str.replace(/\"/g, "");

    str = str.replace(new RegExp("@"+sub_domain, "g"), "");

    return str;
}



//returns a formatted NA number
function cleanTermQueue(str) {
    var res = str.split("@");

    return res[0];
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function postLog(status) {
    $.post("/portal/agents/agentLog/" + status + '/null', function () {
    })
        .fail(function () {
            log('postLog: ' + status + ' failed');
        })
        .done(function () {
            log('postLog: ' + status + ' success');
        });
}

function ownDevice(callid) {
    var device = $('#device').val();
    var devSplit = device.split(" ");
    log(devSplit[0]);
    callToOwn(devSplit[0], callid);
    $('#activateCallBtn').prop("disabled", true);

}

function callToOwn(device, callid) {
    $.post("/portal/phones/own/" + device + "/" + callid, function (data) {

        if (data.trim() == "ok") {
            jsFlash("Please answer the ringing phone (" + device + ")", 'success');
            // $.cookie("agent-device", "device-" + device);
            $('#activate-done').on('click', function () {
                // if on the agents page
                if ($('.phones-panel-home').length > 0) {
                    hotDeskConfirm(device);
                }
                else { // if on the phones page
                    location.reload(true);
                }
            });
        } else
            jsFlash("There was an error placing your call to " + device, "danger");

    })
        .always(function () {
            $('#activateCallBtn').prop("disabled", false);
        });
}

function toggleHiddenUser() {
    if ($('#hideSystemUsers').is(":checked")) {
        $.cookie('user-hidden-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/users", expires: 3600*24*7});
        $.cookie('user-hidden-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('user-hidden-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/users", expires: 3600*24*7});
        $.cookie('user-hidden-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}

function toggleHiddenUserAddresses() {
    if ($('#hideUserAddresses').is(":checked")) {
        $.cookie('user-addresses-hidden-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/inventory/addresses", expires: 3600*24*7});
        $.cookie('user-addresses-hidden-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('user-addresses-hidden-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/addresses", expires: 3600*24*7});
        $.cookie('user-addresses-hidden-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}

function toggleHiddenUserTimeFrames() {
    if ($('#hiddenUsersValueTimeFrames').is(":checked")) {
        $.cookie('user-hidden-timeframes-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/timeframes", expires: 3600*24*7});
        $.cookie('user-hidden-timeframes-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('user-hidden-timeframes-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/timeframes", expires: 3600*24*7});
        $.cookie('user-hidden-timeframes-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}

function toggleHiddenZerosTimeFrames() {
    if ($('#hiddenZerosValueTimeFrames').is(":checked")) {
        $.cookie('hide-zeros-timeframes-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/timeframes", expires: 3600*24*7});
        $.cookie('hide-zeros-timeframes-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('hide-zeros-timeframes-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/timeframes", expires: 3600*24*7});
        $.cookie('hide-zeros-timeframes-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}


function toggleHiddenUserMusic() {
    if ($('#hiddenUsersValueMusic').is(":checked")) {
        $.cookie('user-hidden-music-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/music", expires: 3600*24*7});
        $.cookie('user-hidden-music-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('user-hidden-music-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/music", expires: 3600*24*7});
        $.cookie('user-hidden-music-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}

function toggleHiddenZerosMusic() {
    if ($('#hiddenZerosValueMusic').is(":checked")) {
        $.cookie('hide-zeros-music-'+sub_user+"-"+md5(sub_name), 'true', {path: "/portal/music", expires: 3600*24*7});
        $.cookie('hide-zeros-music-'+sub_user+"-"+md5(sub_name), 'true', {path: "/", expires: 3600*24*7});

    }
    else {
        $.cookie('hide-zeros-music-'+sub_user+"-"+md5(sub_name), 'false', {path: "/portal/music", expires: 3600*24*7});
        $.cookie('hide-zeros-music-'+sub_user+"-"+md5(sub_name), 'false', {path: "/", expires: 3600*24*7});
    }

    location.reload();
}




// toggle enable MOH settings
function toggleEnableMusicOnHold(domain, state) {
    var url = "/portal/music/toggleEnableMOH/" + domain + "/" + state;
    $.post(url, function (data) {
        jsFlash("Music on hold settings have been updated", 'success');

        // change the state of the boxesto indicate whether or not music on hold is on or not
        if (state == false) {
            // hide the panes and show the
            $('.music-panel-main').addClass('hide');
            $('.moh-footer').addClass('hide');

            $('.music-panel-main-no-moh').removeClass('hide');

        } else {
            $('.music-panel-main').removeClass('hide');
            $('.moh-footer').removeClass('hide');


            $('.music-panel-main-no-moh').addClass('hide');

        }

    });
}


// toggle randomize music for MOH settings
function toggleRandomizeMusic(uid = '') {
    var url = "/portal/music/randomize/" + $('#randomizeMusic').is(":checked") + "/" + uid;
    $.post(url, function (data) {
        jsFlash("Music on hold settings have been updated", 'success');
    });
}


function updateInterval(uid, moh_interval) {
    var url = "/portal/music/updateInterval/" + uid + "/" + moh_interval;
    $.post(url, function (data) {
        jsFlash("Music on hold settings have been updated", 'success');
    });

}


function toggleUiconfigDefault() {
    if ($('#showDefaults').is(":checked"))
        $.cookie('uiconfig-showDefaults', 'true', {path: "/portal/uiconfigs", expires: 180});
    else
        $.cookie('uiconfig-showDefaults', 'false', {path: "/portal/uiconfigs", expires: 180});

    location.reload();
}

function releaseDevice(device, queue) {
    var url = "/portal/phones/release/" + device;
    if (typeof queue != 'undefined' && queue != "")
        url = url + "/" + queue;
    $.post(url, function (data) {
        if (data.trim() == "ok")
            jsFlash("The phone (" + device + ") has been released ", 'success');
        else
            jsFlash("There was an error releasing phone " + device, "danger");

        if ($.cookie("agent-device") == device)
            $.cookie("agent-device", null);

        setTimeout(function () {
            if ($('.phones-panel-home').length > 0) {
                homegetPhones();
            }
            else {
                location.reload(true);
            }

        }, 1000);


    });
}

function dynamicStaticChange(isAdd, dynamic) {
    if ($('#ip_control_dd').val() == "Static IP") {
        $('.limit-max_total').animate({
            height: 'show',
            opacity: 'show'
        });
        $('.dynamicipgroup').animate({
            height: 'hide',
            opacity: 'hide'
        });
        $('.staticipgroup').animate({
            height: 'show',
            opacity: 'show'
        });
        $('#authSection').animate({
            height: 'show',
            opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        //#11231 Allow a static sip trunk to be turned into a dynamic registration based sip trunk.
        if (!isAdd && !dynamic) {

            $('#SiptrunkDeviceUserRO').hide();
            $('#SiptrunkDeviceUser').show();

        }
        log("needs work");
        $('.limit-max_total').animate({
            height: 'hide',
            opacity: 'hide'
        });
        $('.staticipgroup').animate({
            height: 'hide',
            opacity: 'hide'
        });
        $('.dynamicipgroup').animate({
            height: 'show',
            opacity: 'show'
        });
        $('#authSection').animate({
            height: 'hide',
            opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    }
}

function iTunkChange(isAdd, enabled) {
    if ($('#itrunk_enabled_dd').bootstrapSwitch('state')) {
        $('.itrunkgroup').animate({
            height: 'show',
            opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        $('.itrunkgroup').animate({
            height: 'hide',
            opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    }
}

function routeTypeChange() {
    // if ($('.route-options').is(':visible'))
    //  $('.route-options').animate({
    //          height: 'hide', opacity: 'hide', queue: true
    //      }, {
    //          progress: function(){
    //              modalResize($(this).parents('.modal'));
    //          }
    //      });

    var type = $('#route_type_dd').val();
    log(type);

    if (type == "percentage") {
        $('.pct-remaining, #pct-equal-btn').animate({
            opacity: 'show',
            width: 'show'
        });
        $('.trunk-method-table').animate({
            opacity: 'hide'
        }, {
            queue: true,
            duration: 200,
            complete: function () {
                $('.route-fixed').hide();
                $('.route-percent').show();
            }
        });
        $('.trunk-method-table').animate({
            opacity: 'show',
            queue: true
        });
    } else if (type == "fixed") {
        $('.pct-remaining, #pct-equal-btn').animate({
            opacity: 'hide',
            width: 'hide'
        });
        $('.trunk-method-table').animate({
            opacity: 'hide'
        }, {
            queue: true,
            duration: 200,
            complete: function () {
                $('.route-percent').hide();
                $('.route-fixed').show();
            }
        });
        $('.trunk-method-table').animate({
            opacity: 'show',
            queue: true
        });
    }

}

function trunkTypeChange() {
    if ($('#trunk_type_dd').val() == "Origination Only" || $('#trunk_type_dd').val() == "Locked") {
        $('.outbound-only').animate({
            height: 'hide', opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        $('.outbound-only').animate({
            height: 'show', opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    }


    if ($('#isAdd').length != 0)
        return;

    if ($('#trunk_type_dd').val() == "Termination Only" || $('#trunk_type_dd').val() == "Locked") {
        $('.inbound-only').animate({
            height: 'hide', opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        $('.inbound-only').animate({
            height: 'show', opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
        ;
    }
}

function authChange() {
    if ($('#auth_dd').val() == "yes") {
        $('#authEnabledSection').animate({
            height: 'show', opacity: 'show'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    } else {
        $('#authEnabledSection').animate({
            height: 'hide', opacity: 'hide'
        }, {
            progress: function () {
                modalResize($(this).parents('.modal'))
            }
        });
    }
}

function updateRecentDomain(event, ui) {
    var domain = ui.item.id;
    var value = ui.item.value;
    var desc = value.replace(domain, "").trim();
    if (desc == domain)
        desc = "";
    log(desc);
    addRecentDomain(domain, desc);
}

function addRecentDomain(domain, desc) {
    domain = $.trim(domain);
    desc = $.trim(desc);

    // use localStorage
    let recentDomains = localStorage.getItem(sub_user + sub_domain + 'recentDomains');

    if (recentDomains == null) {
        recentDomains = domain + "|||" + desc + ",;,";
    } else if (!recentDomains.includes(domain + "|||" + desc + ",;,")) {
        // string does not exist already in the list:
        recentDomains = domain + "|||" + desc + ",;," + recentDomains;
    } else if (recentDomains.includes(domain + "|||" + desc + ",;,")) {
        // if string does exist, add it to the front after removing
        removeRecentDomain(domain, desc);
        recentDomains = localStorage.getItem(sub_user + sub_domain + 'recentDomains');
        recentDomains = domain + "|||" + desc + ",;," + recentDomains;
    }
    localStorage.setItem(sub_user + sub_domain + 'recentDomains', recentDomains);
}

function removeRecentDomain(domain, desc) {
    domain = $.trim(domain);
    desc = $.trim(desc);

    let recentDomains = localStorage.getItem(sub_user + sub_domain + 'recentDomains');
    recentDomains = recentDomains.replaceAll(domain + "|||" + desc + ",;,",'');

    localStorage.setItem(sub_user + sub_domain + 'recentDomains', recentDomains);
    return true;
}

function modifyDialPlanning(event, ui) {
    var domain = ui.item.id;
    modifyDialPlanning4domain(domain);


}

function modifyDialPlanning4domain(domain) {
    $('#staticdomain').text(domain);

    $.getJSON('/portal/siptrunks/dialPlanningLookup/' + domain, function (data) {

        log(data);
        $('#dialplan').empty();
        $('#dialplan').append("<option value=\"\">Please select a Dial Translation</option>");

        $.each(data.plans, function (key, val) {
            var selected = "";
            if (domain == val)
                selected = "selected=\"selected\"";
            $('#dialplan').append("<option value='" + val + "' " + selected + ">" + val + "</option>");
        });
        $('#dialpolicy').empty();
        $('#dialpolicy').append("<option value=\"\">Please select a Dial Permission</option>");
        $.each(data.policies, function (key, val) {

            $('#dialpolicy').append("<option value='" + val + "'>" + val + "</option>");
        });

        $('#dialplanningSection').show();

    });

}

function inventoryMacDomainChange(event, ui, domain) {
    if (typeof domain == 'undefined' || domain == null)
        domain = ui.item.id;
    var a = [1, 2, 3, 4, 5, 6, 7, 8];

    if (typeof lineCountDynamic == 'undefined')
        lineCountDynamic = 3;

    $('#staticdomain').text(domain);
    for (var i = 0; i < a.length; i++) {
        var id = "#line" + a[i];
        $(id).val( "");
        $(id).prop("disabled", true);;


        if (i <= lineCountDynamic)
            $('#device_linerow_' + a[i]).show();
    }

    //log('inventoryMacDomainChange');
    try {
        $.getJSON('/portal/phones/getDevices/' + domain, function (data) {
            if (data == null)
                return;
            log(data);


            var choices = [];

            $.each(data, function (key, val) {
                choices.push({id: key, value: val})

            });

            for (var i = 0; i < a.length; i++) {
                var id = "#line" + a[i];
                $(id).autocomplete({
                    autoFocus: true,
                    source: function (request, response) {
                        var results = $.ui.autocomplete.filter(choices, request.term);
                        if (!results.length) {
                            $(id).validationEngine("showPrompt", _("* No matches found!"), "red", "bottomLeft", true);
                        } else {
                            $(id).validationEngine("hidePrompt");
                        }
                        response(results);
                    }


                });
                $(id).removeAttr("disabled");

            }


        });
    } catch (e) {
    }


}

function dayOfWeekCheck() {
    var inError = false;
    if ($('#TimeframeSelectOption2').is(":checked") && !$('#TimeframeSelectOption3').is(":checked")) {
        var fields = $(".slider_checkbox").serializeArray();
        if (fields.length == 0) {
            inError = true;
        }
    }
    if (inError) {
        $("input[type=submit]").prop("disabled", true);;
    } else
        $("input[type=submit]").removeAttr("disabled");

}

function cleanId(value) {
    //log ("cleanId");
    //log (value);
    if (typeof value != 'undefined')
        var val = value.replace(/\W/g, '-');
    else
        return "";
    //log(val);
    return val;

}

$(function () {
    addAutoCleanFunction();
});

function addAutoCleanFunction() {
    $(".autoclean").change(function () {
        let x = removeSpecials($(this).val());
        $(this).val(x);
    });
    $(".autotrim").change(function () {
        let x = $(this).val().trim();
        $(this).val(x);
    });
}

function removeSpecials(str) {
    var lower = str.toLowerCase();
    var upper = str.toUpperCase();

    var res = "";
    for (var i = 0; i < lower.length; ++i) {
        if (lower[i] != upper[i] || '0123456789'.indexOf(lower[i]) !== -1)
            res += str[i];
    }
    return res;


    function addIEsupport() {
        if (!jQuery.support.cors && window.XDomainRequest) {
            var httpRegEx = /^https?:\/\//i;
            var getOrPostRegEx = /^get|post$/i;
            var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
            var xmlRegEx = /\/xml/i;

            // ajaxTransport exists in jQuery 1.5+
            jQuery.ajaxTransport('xml json', function (options, userOptions, jqXHR) {
                // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page

                var output = '';
                for (property in options) {
                    output += property + ': ' + options[property] + '; ';
                }
                //log(output);
                output = '';
                for (property in userOptions) {
                    output += property + ': ' + userOptions[property] + '; ';
                }
                //log(output);
                output = '';
                for (property in jqXHR) {
                    output += property + ': ' + jqXHR[property] + '; ';
                }
                //log(output);

                if (options.crossDomain)
                    log("options.crossDomain");
                if (options.async)
                    log("options.async");
                if (getOrPostRegEx.test(options.type))
                    log("getOrPostRegEx.test(options.type)");
                if (httpRegEx.test(userOptions.url))
                    log("httpRegEx.test(userOptions.url)");
                if (sameSchemeRegEx.test(userOptions.url))
                    log("sameSchemeRegEx.test(userOptions.url)");


                // && sameSchemeRegEx.test(userOptions.url)

                if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url)) {
                    //log("ok");
                    var xdr = null;
                    var userType = (userOptions.dataType || '').toLowerCase();
                    log("userType=" + userType);
                    return {
                        send: function (headers, complete) {
                            xdr = new XDomainRequest();
                            if (/^\d+$/.test(userOptions.timeout)) {
                                xdr.timeout = userOptions.timeout;
                                log("xdr.timeout=" + xdr.timeout);
                            }
                            xdr.ontimeout = function () {
                                complete(90000, 'timeout');
                            };
                            xdr.onload = function () {
                                var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                                log("allResponseHeaders" + allResponseHeaders);
                                var status = {
                                    code: 200,
                                    message: 'success'
                                };
                                var responses = {
                                    text: xdr.responseText
                                };
                                /*
                             if (userType === 'html') {
                            responses.html = xdr.responseText;
                            } else
                                */
                                try {
                                    if (userType === 'json') {
                                        log("xdr.timeout=" + xdr.timeout);
                                        try {
                                            responses.json = JSON.parse(xdr.responseText);
                                            output = '';
                                            for (property in responses.json) {
                                                output += property + ': ' + responses.json[property] + '; ';
                                            }
                                            log("responses.json=" + output);
                                        } catch (e) {
                                            log("status.message=" + 'parseerror');
                                            status.code = 500;
                                            status.message = 'parseerror';
                                            //throw 'Invalid JSON: ' + xdr.responseText;
                                        }
                                    }
                                    /* else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                    doc.async = false;
                                    try {
                                        doc.loadXML(xdr.responseText);
                                    } catch(e) {
                                        doc = undefined;
                                    }
                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        throw 'Invalid XML: ' + xdr.responseText;
                                    }
                                    responses.xml = doc;
                                }
                                */
                                } catch (parseMessage) {
                                    log("catch.parseMessage=" + parseMessage);
                                    throw parseMessage;
                                } finally {
                                    complete(status.code, status.message, responses, allResponseHeaders);
                                }
                            };
                            xdr.onerror = function () {
                                log("xdr.responseText" + xdr.responseText);
                                complete(500, 'error', {
                                    text: xdr.responseText
                                });

                            };
                            xdr.open(options.type, options.url);
                            //xdr.send(userOptions.data);
                            xdr.send();
                        },
                        abort: function () {
                            if (xdr) {
                                xdr.abort();
                            }
                        }
                    };
                } else
                    log("failed check");
            });
        }
    }

    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                } else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            },
            {
                string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "Opera",
                versionSearch: "Version"
            },
            {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            },
            {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
            },
            {       // for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            {       // for older Netscapes (4-)
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ],
        dataOS: [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]

    };
}

function selectLanguages(containerId, selectId, languages, selected) {
    var options = [];
    for (var i = 0; i < languages.length; i += 1) {
        // todo selected based on users lang
        var optionName = languages[i].name + ' ' + '(' + languages[i].country + ')';
        if (i === 0 && !selected) {
            options.push('<option value="' + languages[i].id + '" selected>' + optionName + '</option>');
        } else if (selected === languages[i].id) {
            options.push('<option value="' + languages[i].id + '" selected>' + optionName + '</option>');
        } else {
            options.push('<option value="' + languages[i].id + '">' + optionName + '</option>');
        }
    }

    var elem = $('#' + selectId);
    elem.empty();
    elem.append(options.join(''));
    if (options.length === 1) { $('#' + containerId).hide(); }
}

function voiceMultipleVendors(voices) {
    return [...new Set(voices.map((item) => item.type))].length > 1;
}

function getSSMLDocumentLink(type) {
    if (type === 'google') {
        return '<a href="https://cloud.google.com/text-to-speech/docs/ssml" target="_blank">' + _('Read more') + '</a>';
    } else if (type === 'polly') {
        return '<a href="https://docs.aws.amazon.com/polly/latest/dg/ssml.html" target="_blank">' + _('Read more') + '</a>';
    } else if (type === 'azure') {
        return '<a href="https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice" target="_blank">' + _('Read more') + '</a>';
    } else if (type === 'watson') {
        return '<a href="https://www.ibm.com/docs/en/wvs/6.1.1?topic=610-text-speech-ssml-programming-guide" target="_blank">' + _('Read more') + '</a>';
    }

    return '';
}

function ssmlSupportMessage(voice) {
    $('#ssml-support').html('<div style="padding-top:4px">' + _('SSML supported') + ' ' + getSSMLDocumentLink(voice.type) + '</div>');
}

function clearSSMLParseError() {
    $('#playing-error').html('');
}

function ssmlDisplayErrorMessage(message, line, col) {
    let msg = message;
    if (line || col) {
        msg = _('Syntax error on line') + ' ' + line + ' ' + _('column') + ' ' + col
    }
    $('#playing-error').html('<div style="padding-top:4px">' + msg + '</div>');
}

function getVoice(voices, voiceId) {
    if (voices) {
        for (let i = 0; i < voices.length; i += 1) {
            if (voiceId === voices[i].id) {
                return voices[i];
            }
        }
    }

    return undefined;
}

function selectVoices(selectId, voices, selected) {
    const options = [];
    const multipleVendors = voiceMultipleVendors(voices);

    for (let i = 0; i < voices.length; i += 1) {
        let str = '';
        if (multipleVendors) {
            str = _(voices[i].type[0].toUpperCase() + voices[i].type.substring(1));
        }

        if (str.length) {
            str = ' (' + str + ')';
        }

        if (i === 0 && !selected) {
            options.push('<option value="' + voices[i].id + '" selected>' + voices[i].name + str + '</option>');
        } else if (selected === voices[i].id) {
            options.push('<option value="' + voices[i].id + '" selected>' + voices[i].name + str + '</option>');
        } else {
            options.push('<option value="' + voices[i].id + '">' + voices[i].name + str + '</option>');
        }
    }

    var elem = $('#' + selectId);
    elem.empty();
    elem.append(options.join(''));
}

function lookupCall(recording, mycallback) {
    $.getJSON(recording['url'], function (data) {
        mycallback();

        $.each(data, function (cid, result) {
            $('tr[recindex]').each(function () {
                if (typeof $(this).data("state") == 'undefined')
                    $(this).data("state", "unknown");

                var newhost = server_name;

                if (typeof result.geo_id == 'undefined') {
                    result.geo_id = "n/a";
                }

                // get number of columns by counting td children
                var numCols = $(this).find('td').length

                const orig = $(this).data("orig-id");
                const term = $(this).data("term-id");
                const jobId = $(this).data("job-id");

                if (cid == $(this).data("orig-id")
                  || cid == $(this).data("term-id")
                  || result.geo_id == $(this).data("term-id")
                  || result.geo_id == $(this).data("orig-id")
                ) {
                    var audioTag = '<audio id="audio-' + $(this).data("orig-id") + '" ' +
                      'data-orig-id="' + $(this).data("orig-id") + '"  data-term-id="' + $(this).data("term-id") + '"' +
                      'controls class="cdraudio" preload="'+PORTAL_CALLHISTORY_RECORDING_PRELOAD+'" >';

                    if (result.status.toLowerCase() === "converted" || result.status.toLowerCase() === "archived") {
                        if ($(this).data("state") !== "available") {
                            console.log('available');
                            var parser = document.createElement('a');
                            parser.href = result.url;

                            if (typeof $(this).attr("recDomain") != 'undefined' && $(this).attr("recDomain") !== "") {
                                newhost = parser.protocol + "//" + $(this).attr("recDomain") + parser.pathname + parser.search;
                            } else {
                                newhost = result.url.replace("/localhost", "/" + newhost);

                            }

                            if ($(this).find('.listen.disabled.statusonly').length) {
                                $(this).find('.listen.disabled.statusonly').replaceWith('<a class="listen helpsy statusonly" title="'+ _('Recording Available') +"." + _('Playback Disabled')+'"></a>');
                            } else {
                                const thisElement = $(this);

                                if (jobId && recording['jobId']
                                  && String(jobId) === String(recording['jobId'])
                                ) {
                                    var user = sub_user;
                                    var currDomain = sub_domain;

                                    NetsapiensVoice.authenticate(user, currDomain).then(function () {
                                        const recordingDate = result.time_open.substring(0,7).replace('-', '');
                                        NetsapiensVoice.getTranscriptionJob({ jobId: recording['jobId'], recordingDate: recordingDate, user, domain: currDomain }).then(function (transcriptionJob) {
                                            console.log('data', transcriptionJob, jobId);
                                            if (transcriptionJob && transcriptionJob.status === 'finished') {
                                                let listenDisabled = thisElement.find('.listen.disabled');
                                                if (!listenDisabled.hasClass('block-recording')) {
                                                    listenDisabled.replaceWith('<a class="listen open-transcription helpsy" title="'+_('Listen')+'" onclick="loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + '\')" data-toggle="modal" data-target="#transcriptions" data-backdrop="static" />');
                                                    let positiveItem = thisElement.find('.table-sentiment-positive').not('.closing-sentiment');
                                                    positiveItem.attr('onclick', 'loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + "/positive" + '\')')
                                                    positiveItem.attr('data-toggle', 'modal');
                                                    positiveItem.attr('data-target', '#transcriptions');
                                                    positiveItem.attr('data-backdrop', 'static');
                                                    positiveItem.css('cursor', 'pointer');
                                                    let neutralItem = thisElement.find('.table-sentiment-neutral').not('.closing-sentiment');
                                                    neutralItem.attr('onclick', 'loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + "/neutral" + '\')')
                                                    neutralItem.attr('data-toggle', 'modal');
                                                    neutralItem.attr('data-target', '#transcriptions');
                                                    neutralItem.attr('data-backdrop', 'static');
                                                    neutralItem.css('cursor', 'pointer');
                                                    let negativeItem = thisElement.find('.table-sentiment-negative').not('.closing-sentiment');
                                                    negativeItem.attr('onclick', 'loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + "/negative" + '\')')
                                                    negativeItem.attr('data-toggle', 'modal');
                                                    negativeItem.attr('data-target', '#transcriptions');
                                                    negativeItem.attr('data-backdrop', 'static');
                                                    negativeItem.css('cursor', 'pointer');

                                                    let closingBadge = thisElement.find('.closing-sentiment');
                                                    closingBadge.attr('onclick', 'loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + "/closing" + '\')')
                                                    closingBadge.attr('data-toggle', 'modal');
                                                    closingBadge.attr('data-target', '#transcriptions');
                                                    closingBadge.attr('data-backdrop', 'static');
                                                    closingBadge.css('cursor', 'pointer');
                                                }
                                                initTooltips();
                                            } else {
                                                let listenDisabled = thisElement.find('.listen.disabled');
                                                if (!listenDisabled.hasClass('block-recording')) {
                                                    listenDisabled.replaceWith('<a class="listen helpsy" title="'+_('Listen')+'"></a>');
                                                    initRecordingBtns(thisElement,numCols,audioTag,newhost);
                                                }
                                            }
                                            let dlAudioDisabled = thisElement.find('.download-audio.disabled');
                                            if (!dlAudioDisabled.hasClass('block-recording')) {
                                                dlAudioDisabled.replaceWith('<a class="download-audio helpsy" title="'+_('Download')+'" href="' + result.url.replace("/localhost", server_name) + '" ></a>');
                                            }



                                            // let dlAudioDisabled = thisElement.find('.download-audio.disabled');
                                            // if (!dlAudioDisabled.hasClass('block-recording')) {
                                            //     if (transcriptionJob && transcriptionJob.status === 'finished') {
                                            //         thisElement.find('.listen.disabled').replaceWith('<a class="listen open-transcription helpsy" onclick="loadModal(\'#transcriptions\', \''+rootPath+'/callhistory/transcription/' + transcriptionJob.id + "/" + recordingDate + "/" + encodeURIComponent(transcriptionJob.services) + "/" + orig + "/" + term + '\')" data-toggle="modal" data-target="#transcriptions" data-backdrop="static" />');
                                            //       } else {
                                            //         thisElement.find('.listen.disabled').replaceWith('<a class="listen helpsy" title="'+_('Listen')+'"></a>');
                                            //         initRecordingBtns(thisElement,numCols,audioTag,newhost);
                                            //       }
                                            //       thisElement.find('.download-audio.disabled').replaceWith('<a class="download-audio helpsy" title="'+_('Download')+'" href="' + result.url.replace("/localhost", server_name) + '" ></a>');
                                            // }
                                        }).catch(function(err){
                                            console.log(err);
                                            initRecordingBtns(thisElement,numCols,audioTag,newhost);
                                        });
                                    }).catch(function(err){
                                        console.log(err);
                                        initRecordingBtns(thisElement,numCols,audioTag,newhost);
                                    });
                                } else {
                                    let listenDisabled = thisElement.find('.listen.disabled');
                                    if (!listenDisabled.hasClass('block-recording')) {
                                        listenDisabled.replaceWith('<a class="listen helpsy" title="'+_('Listen')+'"></a>');
                                        initRecordingBtns(thisElement,numCols,audioTag,newhost);
                                    }

                                    let dlAudioDisabled = thisElement.find('.download-audio.disabled');
                                    if (!dlAudioDisabled.hasClass('block-recording')) {
                                        dlAudioDisabled.replaceWith('<a class="download-audio helpsy" title="'+_('Download')+'" href="' + result.url.replace("/localhost", server_name) + '" ></a>');
                                    }
                                }
                            }

                            $(this).data("state", "available");
                        } else {
                            if (!$(this).find('.listen.disabled.statusonly').length) {
                                if (preferMP4)
                                    $(this).find('cdraudio').append('<td class="cdraudio" colspan="' + numCols + '">' +
                                      audioTag +
                                      '<source src="' + newhost + '&convert=aac" type="audio/mp4">' +
                                      '<source src="' + newhost + '&convert=wav16" type="audio/wav">' +
                                      '</audio>');
                                else
                                    $(this).find('cdraudio').append('<td class="cdraudio" colspan="' + numCols + '">' +
                                      audioTag +
                                      '<source src="' + newhost + '&convert=wav16" type="audio/wav">' +
                                      '<source src="' + newhost + '&convert=aac" type="audio/mp4">' +
                                      '</audio>');
                            }
                        }
                    } else if (result.status.toLowerCase() === "unconverted") {
                        $(this).find('.listen.disabled').replaceWith('<a class="listen disabled helpsy" title="'+_('Pending Conversion')+'"></a>');
                        //$(this).children('.action-buttons').append('<a class="listen disabled helpsy" title="Pending Conversion"></a>');
                    } else if (result.status.toLowerCase() === "unconverted") {
                        $(this).find('.listen.disabled').replaceWith('<a class="listen disabled helpsy" title="'+_('No Recording')+'"></a>');
                        //$(this).children('.action-buttons').append('<a class="listen disabled helpsy" title="Pending Conversion"></a>');
                    }
                    initTooltips();
                }
            });
        });
        initTooltips();
    });
}

function initRecordingBtns(thisElement,numCols,audioTag,newhost){
  $('.tooltip').hide();
  let listenDisabled = thisElement.find('.listen.disabled');
  if (!listenDisabled.hasClass('block-recording')) {
    listenDisabled.replaceWith('<a class="listen helpsy" title="'+_('Listen')+'"></a>');
  }
  let dlAudioDisabled = thisElement.find('.download-audio.disabled');
  if (!dlAudioDisabled.hasClass('block-recording')) {
    dlAudioDisabled.replaceWith('<a class="download-audio helpsy" title="'+_('Download')+'" href="' + newhost + '" ></a>');
  }
  let dlAudioHidden = thisElement.find('.download-audio.hide');
  if (!dlAudioHidden.hasClass('block-recording')) {
      dlAudioHidden.replaceWith('<a class="download-audio helpsy" title="'+_('Download')+'" href="' + newhost + '" ></a>');
  }

  if (preferMP4) {
    thisElement.after('<tr class="audioplayerrow cdraudio hide"><td class="cdraudio" colspan="' + numCols + '">' +
      audioTag +
      '<source src="' + newhost + '&convert=aac" type="audio/aac">' +
      '<source src="' + newhost + '&convert=aac" type="audio/mp4">' +
      '<source src="' + newhost + '&convert=wav16" type="audio/wav">' +
      '</audio>');
  } else {
    thisElement.after('<tr class="audioplayerrow cdraudio hide"><td class="cdraudio" colspan="' + numCols + '">' +
      audioTag +
      '<source src="' + newhost + '&convert=wav16" type="audio/wav">' +
      '<source src="' + newhost + '&convert=aac" type="audio/aac">' +
      '<source src="' + newhost + '&convert=aac" type="audio/mp4">' +
      '</audio>');
  }

  setTimeout(initTooltips,100);
}


function calculateWeekdayInfo(dateString) {
    var date = parseTimeframeDate(dateString, userDateformat);

    // var date = new Date(dateString);
    var dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    var dayOfMonth = date.getDate();
    var ordinalNumber = Math.ceil(dayOfMonth / 7);
    var isFirstOrLast = dayOfMonth <= 7 ? 'first' : '';

    // Check for last occurrence of the weekday
    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (dayOfMonth + 7 > lastDayOfMonth.getDate()) {
        isFirstOrLast = 'last';
    }

    var ordinalString = getOrdinalString(ordinalNumber);

    return {
        dayOfWeek: dayOfWeek,
        ordinalNumber: ordinalNumber,
        ordinalString: ordinalString,
        isFirstOrLast: isFirstOrLast
    };
}

function isLastDayOfMonth(dateString, userDateformat) {
    var date = parseTimeframeDate(dateString, userDateformat);

    // Determine the last day of the month for the given date
    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Compare the date to the last day of the month
    return date.getDate() === lastDayOfMonth.getDate();
}

// Function to parse the date according to the user's date format
function parseTimeframeDate(startDate, userDateFormat) {
    var day, month, year;
    var parts = startDate.split('/');

    switch (userDateFormat) {
        case "dd/mm/yy":
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
            year = parseInt(parts[2], 10);
            break;
        case "mm/dd/yy":
            month = parseInt(parts[0], 10) - 1;
            day = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
            break;
        case "yy/mm/dd":
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
            day = parseInt(parts[2], 10);
            break;
        // Add more cases for different formats if needed
    }

    return new Date(year, month, day);
}

// Helper function to format date and get day of the week
function getDayOfWeekHoliday(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

// Adjusted holiday work function to include day of the week in the readableDate
function formatHoliday(holiday, userDateformat = 'mm/dd/yy') {
    // console.log('this is formatHoliday: ', holiday);

    if (holiday.name === 'Leap Day') {
        holiday.date = getNextLeapYearDate();
    }

    const year = holiday.date.datetime.year.toString();
    const month = String(holiday.date.datetime.month).padStart(2, '0'); // Adds leading zero if needed
    const day = String(holiday.date.datetime.day).padStart(2, '0'); // Adds leading zero if needed

    // Create a Date object to find the day of the week
    const date = new Date(year, month - 1, day);
    const dayOfWeek = getDayOfWeekHoliday(date);

    // create api date YYYYMMDD
    const apiDate = `${year}${month}${day}`;

    // Include day of week in the formatted date
    const readableDate = `${dayOfWeek}, ` + formatHolidayByUserPreference(year, month, day, userDateformat, dayOfWeek);

    return {
        uuid: holiday.uuid,
        name: holiday.name,
        countryId: holiday.country,
        locations: holiday.locations,
        date: apiDate, // Use the ISO formatted date for internal purposes
        apiDate: apiDate,
        readableDate: readableDate // User-preferred formatted date with day of week
    };
}

function getNextLeapYearDate() {
    const currentYear = new Date().getFullYear();
    let year = currentYear;

    // Function to check if a year is a leap year
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Check if the current year is a leap year and today's date is before or on February 29
    const today = new Date();
    if (isLeapYear(year) && (today.getMonth() < 1 || (today.getMonth() === 1 && today.getDate() <= 29))) {
        // Current year is a leap year and it's before or on February 29
    } else {
        // Find the next leap year
        year++;
        while (!isLeapYear(year)) {
            year++;
        }
    }

    return {
        "iso": `${year}-02-29`,
        "datetime": {
            "year": year,
            "month": 2,
            "day": 29
        }
    };
}

function formatHolidayByUserPreference(year, month, day, userFormat) {
    let formattedDate = userFormat
        .replace(/yy/g, year) // For 'yy' format, get last two digits of year
        .replace(/mm/g, month)
        .replace(/dd/g, day);

    return formattedDate;
}

function convertTimeToMinutes(timeStr, userTimeDelimiter = ':') {
    // Escape the delimiter in case it's a special character in regex (e.g., '.')
    const escapedDelimiter = userTimeDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Construct regex patterns to match both 24-hour and 12-hour formats
    const regex24HourPattern = new RegExp(`(\\d{1,2})${escapedDelimiter}(\\d{2})`);
    const regex12HourPattern = new RegExp(`(\\d{1,2})${escapedDelimiter}(\\d{2})\\s?(am|pm)?`, 'i');

    // First try matching 12-hour format
    let parts = timeStr.match(regex12HourPattern);

    if (!parts) {
        // No AM/PM marker found; try matching 24-hour format
        parts = timeStr.match(regex24HourPattern);
        if (!parts) return null; // or handle invalid format if both matches fail
    }

    let hours = parseInt(parts[1], 10);
    let minutes = parseInt(parts[2], 10);

    // Adjust hours for AM/PM if present
    if (parts[3]) { // Check if AM/PM part exists
        let amPm = parts[3].toLowerCase();
        if (amPm === 'pm' && hours < 12) hours += 12;
        if (amPm === 'am' && hours == 12) hours = 0;
    } else {
        // For 24-hour format, ensure hours fall within [0, 23]
        hours = hours % 24;
    }

    return hours * 60 + minutes;
}

/**
 * Validates a date string against a specific date format.
 * It checks for the correct placement and validity of the day, month, and year components within the date string.
 * It also performs logical date validation to ensure the date exists in the calendar (e.g., no February 30).
 *
 * @param {string} dateString - The date string to validate.
 * @param {string} dateFormat - The format of the date string (e.g., "mm/dd/yyyy").
 * @returns {boolean} - True if the date string is valid according to the dateFormat, false otherwise.
 */
function isValidDateInput(dateString, dateFormat) {
    let delimiter = /[^mdy]/.exec(dateFormat)[0];
    let theFormat = dateFormat.split(delimiter);
    let theDate = dateString.split(delimiter);

    let day, month, year = false;

    // Identify the format dynamically and validate component sizes
    for (let i = 0; i < theFormat.length; i++) {
        let component = theDate[i];
        let formatPart = theFormat[i];

        // Check component length and value based on format part
        if (/m/.test(formatPart.toLowerCase())) {
            month = parseInt(component, 10);
            if (component.length > 2 || isNaN(month) || month < 1 || month > 12) return false;
        } else if (/d/.test(formatPart.toLowerCase())) {
            day = parseInt(component, 10);
            if (component.length > 2 || isNaN(day) || day < 1 || day > 31) return false;
        } else if (/y/.test(formatPart.toLowerCase())) {
            year = parseInt(component, 10);
            if (component.length !== 4 || isNaN(year)) return false;
        }
    }

    // Logical date validation to catch invalid dates like February 30
    let date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day) {
        return true;
    } else {
        return false;
    }
}
