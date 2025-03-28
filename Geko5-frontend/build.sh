rm -rf build; 
rm -rf build.tgz; 
npm run build && chown -R wisnam:wisnam build;

rm -rf /home/wisnam/geko5/gui;
mv build  /home/wisnam/geko5/gui
#tar zcvf gui.tgz gui && scp gui.tgz wisnam@192.168.21.34:/home/wisnam/geko5


# sed -i 's#/static/css/main#/wsn_extensions/historical-telemetry/build/static/css/main#g' ./build/index.html 
# sed -i 's#/static/js/main#/wsn_extensions/historical-telemetry/build/static/js/main#g' ./build/index.html 
