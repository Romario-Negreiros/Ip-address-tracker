const errBox = $('.error_warning')
errBox.hide();

const api_url = 'https://geo.ipify.org/api/v1';
const api_key = 'at_MtyFjPLjofX68L8nEinBb0M2EZiYn&ipAddress';

const regexIp = /[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}[.]{1}[0-9]{1,3}/;
const regexDomain = /^[aA-zZ]*[.]{1}[aA-zZ]{2,3}$/;

const map = L.map('map');
const marker = L.marker([0, 0]).addTo(map);
L.tileLayer(
    'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=pcxbDReDUNkbbfCq88KM',
    {
        attribution:
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
).addTo(map);

// Mode === search by ip address or domain
const getInputValueAndMode = () => {
    const inputValue = $('#text').val();
    if (inputValue.match(regexIp)) {
        getIpAddressOrDomainData('ipAddress', inputValue);
    } else if (inputValue.match(regexDomain)) {
        getIpAddressOrDomainData('domain', inputValue);
    } else {
        errBox.append(
            'Insert a valid ip address, such as 8.8.8.8, or a valid domain, like nodejs.org'
        );
        errBox.fadeIn().delay(5000).slideUp();
    }
};

const getIpAddressOrDomainData = (mode, value) => {
    $('#text').val('');
    $.ajax({
        url: `${api_url}?apiKey=${api_key}&${mode}=${value}`,
    })
        .done(data => {
            const {
                ip,
                isp,
                location: { city, country, postalCode, timezone, lat, lng },
            } = data;
            $('.ip').html(ip);
            $('.isp').html(isp);
            $('.location').html(`${city}, ${country}, ${postalCode}`);
            $('.timezone').html('UTC ' + timezone);
            setMap(lat, lng);
        })
        .catch(err => {
            const getErrMsg = err.responseJSON.messages;
            errBox.append(getErrMsg);
            errBox.fadeIn().delay(1500).slideUp();
        });
};

// Set new view and maker lat and lng
const setMap = (latitude = 1, longitude = 0) => {
    map.setView([latitude, longitude], 10);
    L.marker([latitude, longitude]).addTo(map);
};

// Loads LeaftletJS either in the current user's location or in a default place
$(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const {
                coords: { latitude, longitude },
            } = position;
            setMap(latitude, longitude);
        });
    } else setMap();
});

// Event handlers for make the search
$(() => {
    $('#search').on('click', getInputValueAndMode);
    $('#text').on('keypress', ({ key }) => {
        key === 'Enter' ? getInputValueAndMode() : '';
    });
});
