const api_url = 'https://geo.ipify.org/api/v1';
const api_key = 'at_MtyFjPLjofX68L8nEinBb0M2EZiYn&ipAddress';
const regexIp = /[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}/;
const regexDomain = /^[aA-zZ]*[.]{1}[aA-zZ]{2,3}$/;

const getIpAddressOrDomainData = (mode, value) => {
    $('#text').val('');
    $.ajax({
        url: `${api_url}?apiKey=${api_key}&${mode}=${value}`,
    })
        .done(data => {
            const {
                ip,
                isp,
                location: { city, country, postalCode, timezone },
            } = data;
            console.log(ip, isp, city, country, postalCode, timezone);
            $('.ip').html(ip);
            $('.isp').html(isp);
            $('.location').html(`${city}, ${country}, ${postalCode}`);
            $('.timezone').html('UTC ' + timezone);
        })
        .catch(err => {
            const getErrMsg = err.responseJSON.messages;
            console.log(getErrMsg);
        });
};

const getLocation = () => {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
            position => {
                const {
                    coords: { latitude, longitude },
                } = position;
                const map = L.map('map').setView([latitude, longitude], 10);
                L.tileLayer(
                    'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=pcxbDReDUNkbbfCq88KM',
                    {
                        attribution:
                            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                    }
                ).addTo(map);
            },
            err => console.log(err)
        );
    else alert('Sorry, but your browser');
};

// Loads LeaftletJS either in the current user's location or in a default place
$(() => {
    getLocation();
});

$(() => {
    $('#search').on('click', () => {
        const inputValue = $('#text').val();
        if (inputValue.match(regexIp)) {
            getIpAddressOrDomainData('ipAddress', inputValue);
        } else if (inputValue.match(regexDomain)) {
            getIpAddressOrDomainData('domain', inputValue);
        } else {
            alert(
                'Insert a valid ip adress, like: 8.8.8.8, or a valid domain, like: nodejs.org'
            );
        }
    });
});
