file_name='mag_data.json'
fid = fopen(file_name); 
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 
val = jsondecode(str);
m=cell2mat(struct2cell(val));
% figure;
% x=1:2330;
% plot(x,m(4,:),x,m(5,:),x,m(6,:));
% figure;
% plot(x,m(1,:),x,m(2,:),x,m(3,:));
% figure;
% stem(fft(m(4,:)));
fcuts=[0 1000/(2330*2)];
mags=[1 0];
devs=[0.05 0.01];
[n,Wn,beta,ftype]=kaiserord(fcuts,mags,devs);
hh=fir1(n,Wn,ftype,kaiser(n+1,beta));

res1=filter(hh,1,m(4,:));
res2=filter(hh,1,m(5,:));
res3=filter(hh,1,m(6,:));
plot(x,res1,x,res2,x,res3);